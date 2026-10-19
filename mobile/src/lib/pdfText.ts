// On-device text extraction (iOS PDFKit / Vision). Native side: ios/ExamPilot/PdfTextModule.swift.
import { NativeModules, Platform } from 'react-native';

const native:
  | {
      pdfText(uri: string): Promise<{ pageCount: number; pages: string[] }>;
      imageText(uri: string): Promise<string[]>;
    }
  | undefined = Platform.OS === 'ios' ? NativeModules.PdfText : undefined;

const unsupported = () =>
  Promise.reject(new Error('Reading files needs the iOS app for now.'));

export const pdfText = (uri: string) =>
  native ? native.pdfText(decodeURI(uri)) : unsupported();
export const imageText = (uri: string) =>
  native ? native.imageText(decodeURI(uri)) : unsupported();

/** Page texts for a saved study PDF: from SQLite when already read, otherwise extracted once and cached. */
export async function studyPdfText(materialId: string, uri: string) {
  const { loadPdfText, savePdfText } = await import('../data/db');
  const cached = await loadPdfText(materialId);
  if (cached) return cached;
  const { pages } = await pdfText(uri);
  await savePdfText(materialId, pages);
  return pages;
}
