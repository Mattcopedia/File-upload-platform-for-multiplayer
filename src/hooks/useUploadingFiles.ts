'use client';

import { useState } from 'react';

import pLimit from 'p-limit';

import { AllowedMimeTypesEnum, MAX_MEDIA } from '@/constants';
import UploadsApi from '@/services/upload';
import { extractFileMeta } from '@/utils/file-page-count';
import { generateFileId } from '@/utils/generate-unique-id';

export interface UploadingFile {
  id: string;
  file: File;
  progress?: number;
  name: string;
  key?: string;
  error?: string;
  uploadId?: string;
  controller?: AbortController;
  aborted?: boolean;
  uniqueFileId: string;
}

function calculateChunkSize(fileSizeBytes: number): number {
  const MIN_PART_SIZE = 5 * 1024 * 1024; // 5 MB (S3 minimum)
  const MAX_PART_SIZE = 64 * 1024 * 1024; // 64 MB cap
  const MAX_PARTS = 10_000;

  // If ≤ 100 MB → single upload
  if (fileSizeBytes <= 100 * 1024 * 1024) {
    return fileSizeBytes;
  }

  // Start with 8 MB default
  let partSize = 8 * 1024 * 1024;
  let parts = Math.ceil(fileSizeBytes / partSize);

  // Increase part size until we are under max parts
  while (parts > MAX_PARTS && partSize < MAX_PART_SIZE) {
    partSize *= 2;
    parts = Math.ceil(fileSizeBytes / partSize);
  }

  // Cap at MAX_PART_SIZE
  if (partSize > MAX_PART_SIZE) {
    partSize = MAX_PART_SIZE;
    parts = Math.ceil(fileSizeBytes / partSize);
  }

  // Ensure partSize is not smaller than MIN_PART_SIZE
  if (partSize < MIN_PART_SIZE) {
    partSize = MIN_PART_SIZE;
    parts = Math.ceil(fileSizeBytes / partSize);
  }

  return partSize;
}

export function useUploadFiles() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  /** ---------------- Single File Upload (<100MB) ---------------- */
  const uploadSingleFile = async (file: UploadingFile) => {
    const name = file.name || file.file.name;
    const meta = await extractFileMeta(file.file);
    const isPdf =
      file.file.type === 'application/pdf' && file.file.name.toLowerCase().endsWith('.pdf');
    const extra = isPdf && meta?.pageCount ? { pageCount: meta.pageCount } : {};
    const { url, key } = await UploadsApi.getPresignedUrl({
      filename: name,
      mimetype: file.file.type as AllowedMimeTypesEnum,
      ...extra,
    });
    const controller = new AbortController();

    setUploadingFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, controller, key } : f))
    );

    try {
      await UploadsApi.putFileToS3({
        url,
        file: file.file,
        onProgress: (percent) => {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === file.id && !f.aborted ? { ...f, progress: percent } : f))
          );
        },
        signal: controller.signal,
      });

      await UploadsApi.completeSingleUpload({ key });

      return { ...file, key, progress: 100, controller: undefined };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('aborted');
      }
      throw error;
    }
  };

  const uploadMultipartFile = async (file: UploadingFile) => {
    const name = file.name || file.file.name;
    const meta = await extractFileMeta(file.file);
    const isPdf =
      file.file.type === 'application/pdf' && file.file.name.toLowerCase().endsWith('.pdf');
    const extra = isPdf && meta?.pageCount ? { pageCount: meta.pageCount } : {};
    const { uploadId, key } = await UploadsApi.initiateMultipartUpload({
      filename: name,
      mimetype: file.file.type as AllowedMimeTypesEnum,
      ...extra,
    });

    const controller = new AbortController();
    setUploadingFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, uploadId, key, controller, progress: 1 } : f))
    );

    try {
      const chunkSize = calculateChunkSize(file.file.size);
      const totalChunks = Math.ceil(file.file.size / chunkSize);
      const chunks = Array.from({ length: totalChunks }, (_, i) =>
        file.file.slice(i * chunkSize, (i + 1) * chunkSize)
      ).filter((c) => c.size > 0);

      const { urls } = await UploadsApi.getMultipartPresignedUrls({
        key,
        uploadId,
        partNumbers: chunks.map((_, i) => i + 1),
      });

      const parts: { ETag: string; PartNumber: number }[] = Array(chunks.length);
      const limit = pLimit(6);
      let completedParts = 0;

      await Promise.all(
        chunks.map((chunk, i) =>
          limit(async () => {
            // Check if aborted before proceeding
            const currentFile = uploadingFiles.find((f) => f.id === file.id);
            if (currentFile?.aborted) {
              throw new Error('aborted');
            }

            const url = urls[i].url;
            const res = await fetch(url, {
              method: 'PUT',
              headers: { 'Content-Type': file.file.type },
              body: chunk,
              signal: controller.signal, // Pass AbortController signal
            });

            if (!res.ok) throw new Error(`Failed uploading part ${i + 1}`);

            const eTag = res.headers.get('ETag')?.replace(/"/g, '') || '';
            parts[i] = { ETag: eTag, PartNumber: i + 1 };
            completedParts++;
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === file.id && !f.aborted
                  ? { ...f, progress: Math.round((completedParts / chunks.length) * 100) }
                  : f
              )
            );
          })
        )
      );

      await UploadsApi.completeMultipartUpload({ key, uploadId, parts });
      return { ...file, progress: 100, uploadId: undefined, controller: undefined };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('aborted');
      }
      throw error;
    }
  };

  const abortUpload = async (file: UploadingFile) => {
    setUploadingFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, aborted: true } : f)));

    try {
      if (file.controller) {
        file.controller.abort();

        if (file.uploadId && file.key) {
          await UploadsApi.abortMultipartUpload({ uploadId: file.uploadId, key: file.key });
        } else if (file.key) {
          await UploadsApi.abortSingleUpload({ key: file.key });
        }
      }
    } finally {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                progress: undefined,
                controller: undefined,
                key: undefined,
                uploadId: undefined,
                error: undefined,
                uniqueFileId: generateFileId(),
                aborted: undefined,
                name: '',
              }
            : f
        )
      );
    }
  };

  /** ---------------- File Management ---------------- */
  const addFiles = (files: FileList) => {
    const allSelectedFiles = Array.from(files).slice(0, MAX_MEDIA);

    const allFilesWithId = allSelectedFiles.map((file) => {
      return {
        id: crypto.randomUUID(),
        file,
        error: undefined,
        uniqueFileId: generateFileId(),
      } as UploadingFile;
    });

    setUploadingFiles((prev) => [...prev, ...allFilesWithId]);
  };

  const updateFileName = (index: number, newName: string) => {
    setUploadingFiles((prev) => prev.map((f, i) => (i === index ? { ...f, name: newName } : f)));
  };

  return {
    uploadingFiles,
    setUploadingFiles,
    addFiles,
    updateFileName,
    uploadSingleFile,
    uploadMultipartFile,
    abortUpload,
  };
}
