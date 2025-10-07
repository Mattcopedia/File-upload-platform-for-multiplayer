import { unzip } from 'unzipit';

import { AllowedMimeTypesEnum } from '@/constants';

/**
 * Extract only allowed files from a zip and return them as File[]
 * Skips unsupported files and logs why they were skipped.
 */
export async function unzipFile(file: File): Promise<File[]> {
  try {
    const { entries } = await unzip(file);
    const entryNames = Object.keys(entries);
    if (entryNames.length === 0) {
      return [];
    }

    const allowedTypes = new Set(Object.values(AllowedMimeTypesEnum));

    // simple extension -> mime map (add more if needed)
    const extToMime: Record<string, string> = {
      jpg: AllowedMimeTypesEnum.JPEG,
      jpeg: AllowedMimeTypesEnum.JPEG,
      png: AllowedMimeTypesEnum.PNG,
      pdf: AllowedMimeTypesEnum.PDF,
      txt: AllowedMimeTypesEnum.TEXT,
      csv: AllowedMimeTypesEnum.CSV,
    };

    const result: File[] = [];

    for (const [path, entry] of Object.entries(entries)) {
      // entry.isDirectory is what unzipit exposes for directories
      if (entry.isDirectory) continue;

      // path may contain folder(s): "folder/sub/file.pdf"
      const baseName = path.split('/').pop() || path;
      const ext = baseName.split('.').pop()?.toLowerCase() || '';

      // Read raw data from the entry
      const arrayBuffer = await entry.arrayBuffer();
      // infer mime from extension first (most reliable for zip entries)
      const inferredMime = extToMime[ext] ?? '';

      // Create blob with inferred mime (if we have one). This avoids blob.type === ''
      const blob = new Blob([arrayBuffer], { type: inferredMime || undefined });

      // final type to check against allowed list
      const finalType = inferredMime || blob.type || '';

      if (!allowedTypes.has(finalType as AllowedMimeTypesEnum)) {
        continue;
      }

      const extractedFile = new File([blob], baseName, { type: finalType });
      result.push(extractedFile);
    }

    return result;
  } catch (err) {
    throw err;
  }
}
