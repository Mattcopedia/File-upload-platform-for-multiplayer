export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjsLib = await import('pdfjs-dist');

  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}

export async function extractFileMeta(file: File) {
  let pageCount: number | undefined;

  if (
    typeof window !== 'undefined' &&
    (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
  ) {
    pageCount = await getPdfPageCount(file);
  } else {
  }

  return {
    filename: file.name,
    mimetype: file.type,
    pageCount,
  };
}
