// On-device text extraction for admit cards and study PDFs.
//   pdfText(uri)  → { pageCount, pages: [String] } via PDFKit (PDFs with a text layer)
//   imageText(uri) → [String] lines via Vision OCR (photos of an admit card)
// Exposed to JS as NativeModules.PdfText.
import Foundation
import PDFKit
import UIKit
import Vision

@objc(PdfText)
class PdfTextModule: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { false }

  private func url(from uri: String) -> URL? {
    if uri.hasPrefix("file://") { return URL(string: uri) }
    return URL(fileURLWithPath: uri)
  }

  @objc func pdfText(_ uri: String, resolver resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    DispatchQueue.global(qos: .userInitiated).async {
      guard let u = self.url(from: uri) else {
        reject("bad_uri", "Not a file path: \(uri)", nil)
        return
      }
      let scoped = u.startAccessingSecurityScopedResource()
      defer { if scoped { u.stopAccessingSecurityScopedResource() } }
      guard let doc = PDFDocument(url: u) else {
        reject("open_failed", "Couldn't open that PDF", nil)
        return
      }
      var pages: [String] = []
      for i in 0..<doc.pageCount {
        pages.append(doc.page(at: i)?.string ?? "")
      }
      resolve(["pageCount": doc.pageCount, "pages": pages])
    }
  }

  @objc func imageText(_ uri: String, resolver resolve: @escaping (Any?) -> Void, rejecter reject: @escaping (String?, String?, Error?) -> Void) {
    DispatchQueue.global(qos: .userInitiated).async {
      guard let u = self.url(from: uri),
            let data = try? Data(contentsOf: u),
            let image = UIImage(data: data)?.cgImage
      else {
        reject("open_failed", "Couldn't open that image", nil)
        return
      }
      let request = VNRecognizeTextRequest { req, err in
        if let err = err {
          reject("ocr_failed", err.localizedDescription, err)
          return
        }
        let obs = (req.results as? [VNRecognizedTextObservation]) ?? []
        // Group words into rows by vertical position so table rows stay on one line.
        let items = obs.compactMap { o -> (String, CGRect)? in
          guard let t = o.topCandidates(1).first?.string else { return nil }
          return (t, o.boundingBox)
        }
        var rows: [(y: CGFloat, parts: [(x: CGFloat, t: String)])] = []
        for (t, box) in items.sorted(by: { $0.1.midY > $1.1.midY }) {
          if let i = rows.firstIndex(where: { abs($0.y - box.midY) < box.height * 0.6 }) {
            rows[i].parts.append((box.minX, t))
          } else {
            rows.append((box.midY, [(box.minX, t)]))
          }
        }
        resolve(rows.map { $0.parts.sorted { $0.x < $1.x }.map(\.t).joined(separator: " ") })
      }
      request.recognitionLevel = .accurate
      request.usesLanguageCorrection = false
      do {
        try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
      } catch {
        reject("ocr_failed", error.localizedDescription, error)
      }
    }
  }
}
