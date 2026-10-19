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
