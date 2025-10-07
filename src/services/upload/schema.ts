import { array, mixed, number, object, string } from 'yup';

import { Allowed_Mime_Types } from '@/constants';
import { isValidBaseFileName, isValidFileName, validNamePattern } from '@/utils/file-validation';

export const presignedUploadSchema = object({
  filename: string()
    .matches(
      validNamePattern,
      'Filename must follow format: HospitalName-PatientName-Location-YYYYMMDD.ext'
    )
    .test('valid-date', 'Invalid date in filename (YYYYMMDD)', (value) =>
      value ? isValidFileName(value) : false
    )
    .required('Filename is required'),
  mimetype: string()
    .oneOf(Allowed_Mime_Types, 'Invalid file type')
    .required('MIME type is required'),
  fileSize: number().positive('File size must be a positive number').optional(),
});

export const initiateMultipartSchema = object({
  filename: string()
    .matches(
      validNamePattern,
      'Filename must follow format: HospitalName-PatientName-Location-YYYYMMDD.ext'
    )
    .test('valid-date', 'Invalid date in filename (YYYYMMDD)', (value) =>
      value ? isValidFileName(value) : false
    )
    .required('Filename is required'),
  mimetype: string()
    .oneOf(Allowed_Mime_Types, 'Invalid file type')
    .required('MIME type is required'),
});

export const multipartPartRequestSchema = object({
  key: string().required('Key is required'),
  uploadId: string().required('UploadId is required'),
  partNumbers: array()
    .of(number().min(1, 'Part numbers start at 1').required())
    .min(1, 'At least one part number is required')
    .required(),
});

export const singlePartSchema = object({
  ETag: string().required('ETag is required'),
  PartNumber: number().min(1, 'Part number must be >= 1').required('Part number is required'),
});

export const completeMultipartSchema = object({
  key: string().required('Key is required'),
  uploadId: string().required('UploadId is required'),
  parts: array().of(singlePartSchema).min(1, 'Must include at least one part').required(),
});

export const abortMultipartSchema = object({
  key: string().required('Key is required'),
  uploadId: string().required('UploadId is required'),
});
export const abortSingleSchema = object({
  key: string().required('Key is required'),
});

export const completeSingleUploadSchema = object({
  key: string().required('Key is required'),
});

export const putFileToS3Schema = object({
  url: string().url('Invalid presigned URL').required('Presigned URL is required'),
  file: mixed<File>()
    .required('File is required')
    .test('file-type', 'Invalid file type', (file) => !!file && file instanceof File),
});

export const validateFileNameSchema = object({
  initialFinalName: string()
    .matches(
      validNamePattern,
      'Filename must follow format: FileName_UniqueIDNumber_HospitalName_YYYYMMDD \n(Date of first entry on the folder)'
    )
    .test('valid-date', 'Invalid date in filename (YYYYMMDD)', (value) => {
      if (!value) return true;
      return isValidFileName(value);
    })

    .required('Filename is required'),
});

export const isValidBaseFileNameSchema = object({
  initialFinalName: string()
    .test('File name', 'Invalid File name', (value) => {
      if (!value) return true;
      return isValidBaseFileName(value);
    })

    .required('File name is required'),
});
