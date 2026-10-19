# Admit Card / Hall Ticket Timetable Extraction for ExamPilot

Research date: 18 October 2026. Prices, model names and free-tier rules change often; every figure below should be re-checked on the linked page before launch.

## 1. What do Indian university admit cards / hall tickets contain?

### Takeaway
A typical hall ticket has a candidate block (name, seat number, university/enrolment code, photo, signatures) and a subject table (course code plus title, date with weekday, time range). Every card holds personal data, including a facial photo, so the app should only keep the timetable rows.

### Cited Findings
- A real Mumbai University-affiliated hall ticket (SIES GST, June 2026, SE AIML Sem III R-19 KT) has: Name, Seat No., Gender, University Code (nine digits followed by "M"), Examination name, College Code, "Exam held in" (college name), and a hall ticket number. Below that comes a subject table with the course code and title in one cell ("CSC301 ENGINEERING MATHEMATICS - III") and a combined Date & Time field. The footer has the candidate's signature, principal's signature, candidate's photo and Controller of Examinations sign-off. The PDF carries three tickets per page — [SIES GST hall ticket PDF](https://siesgst.edu.in/docs/exam/AIML%20SEM%20III%20R-19%20KT.pdf)
- Exact formats in that sample: date "02/06/2026, TUESDAY" (DD/MM/YYYY plus the weekday in capitals) and time "02:30 PM to 05:30 PM" (12-hour clock with "to"). The subject code is not in its own column; it is the first word of the course title — [SIES GST hall ticket PDF](https://siesgst.edu.in/docs/exam/AIML%20SEM%20III%20R-19%20KT.pdf)
- The SIES site hosts other hall-ticket PDFs in the same format (IT Sem VII R-19 KT, AIML Sem I special exam) — [SIES IT Sem VII](https://siesgst.edu.in/docs/exam/IT%20SEM%20VII%20R-19%20KT.pdf), [SIES AIML Sem I SPL](https://siesgst.edu.in/docs/exam/AIML%20SEM%20I-%20SPL%20EXAM.pdf)

### Inferences
- Layouts differ by university, so a fixed template parser will break. The design has to handle code and name sharing a cell, date and time sharing a cell, several tickets on one page, and missing columns.
- Some portals (for example GTU, Parul, AKTU, SPPU) also print a "session" label (Morning/Afternoon) or exam type (theory/practical). I did not check this against primary samples for those universities, so treat it as unverified.
- Personal data on a card: name, enrolment/university number, seat number, gender, photo (biometric-like), signature, and college. None of this is needed to build a calendar beyond the subject rows. Seat number and exam centre may be handy for the student, but they are optional.

### Gaps
- I did not collect primary samples from Parul University, GTU, SPPU, AKTU or VTU. Collect 10 to 20 real (redacted) cards to build a test set.
- I found no source on how many universities issue text-based PDFs and how many issue scanned PDFs, or how often students upload phone photos or screenshots.

## 2. Option A: multimodal LLM (Gemini) with a JSON schema

### Takeaway
Gemini takes PDFs and images directly and can be forced to return schema-valid JSON. This is the most robust choice for messy layouts and phone photos. The free tier costs nothing, but Google's terms say free-tier prompts may be read by human reviewers and used for training, and they tell you not to send personal information. For admit cards, use the paid tier, which costs well under ₹0.1 per card, or redact first.

### Cited Findings
- Gemini handles PDFs up to 50 MB or 1,000 pages, inline or through the Files API. Uploaded files are kept for 48 hours. Each page counts as about 258 tokens. On Gemini 3 models, text natively embedded in the PDF is extracted and not billed, and page images are billed as IMAGE tokens. Pages are scaled to between 768×768 and 3072×3072. A `media_resolution` (low/medium/high) setting exists. The docs advise rotating pages upright and avoiding blurry pages — [Gemini document understanding docs](https://ai.google.dev/gemini-api/docs/document-processing?authuser=1)
- Structured output: set JSON mime type plus a `schema` (a subset of JSON Schema). Supported keywords include string `enum` and `format` (date, time, date-time), `required`, `minItems`/`maxItems`, and nullable types. The JS SDK can use Zod (`z.fromJSONSchema`). The docs warn that the output is "syntactically correct JSON" and you should "always validate values in your application", because schema-valid output can still be semantically wrong. Note: the current docs show a newer `client.interactions.create` and `response_format` API shape, not the older `responseMimeType`/`responseSchema` names — [Gemini structured output docs](https://ai.google.dev/gemini-api/docs/structured-output)
- Pricing page as of October 2026: free tier available for Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite and 3 Flash Preview. Paid rates per 1M tokens, input/output: 3.1 Flash-Lite $0.25/$1.50, 3.5 Flash-Lite $0.30/$2.50, 3.8 Flash $0.75/$3.75. Some prices rise on 1 Dec 2026 or 1 Jan 2027 — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- The pricing page row "Used to improve our products" reads Yes for the free tier and No for the paid tier — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Gemini API terms, Unpaid Services: human reviewers "may read, annotate, and process your API input and output"; "Do not submit sensitive, confidential, or personal information to the Unpaid Services." Paid Services: prompts are not used to improve products and are logged only for a limited time for abuse detection. API users must be 18 or older — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
- Google does not publish fixed free-tier RPM/RPD limits for current models; AI Studio shows them per project. Gemini 2.5 Flash's free tier was cut to about 5 RPM / 20 RPD on 2025-12-06. The Batch API costs half price. (Secondary aggregator; check in AI Studio) — [agentdeals.dev Gemini pricing changes](https://agentdeals.dev/gemini-api-pricing-changes)

### Inferences
- Cost per card, my estimate: a 1 to 2 page card is about 300 to 600 input tokens of image (more at high media resolution), plus about 300 prompt tokens and about 500 output tokens. On 3.1 Flash-Lite that is roughly $0.001 per card, about ₹0.08–0.1. A thousand cards would cost about $1. Cost is not the constraint; free-tier rate limits and the privacy terms are.
- Accuracy: I found no published benchmark for Indian hall tickets. In general, Flash-class multimodal models read printed tables and phone photos well. Known failure modes are swapping DD/MM for MM/DD, inventing the year, merging rows, and misreading subject codes (O/0, I/1, S/5). Mitigate by: asking the model to return the raw date string alongside the normalised ISO date, a `confidence` field per row, low temperature, and post-validation in code.
- Free tier plus personal data conflicts with Google's own terms. Two compliant routes: (a) use a paid key, which can stay near-zero cost with a spend cap; or (b) crop or redact the candidate block client-side and send only the timetable region.
- The key must stay server-side (Firebase Cloud Function or Supabase Edge Function), never in the React bundle. The 18+ rule applies to the developer account, not to end users, but still check terms if the app has users under 18.

Suggested schema sketch:
```json
{ "type":"object", "properties":{
  "exams":{"type":"array","items":{"type":"object","properties":{
    "subject_code":{"type":["string","null"]},
    "subject_name":{"type":"string"},
    "date_raw":{"type":"string"},
    "date_iso":{"type":["string","null"],"format":"date"},
    "start_time":{"type":["string","null"],"format":"time"},
    "end_time":{"type":["string","null"],"format":"time"},
    "session_label":{"type":["string","null"]},
    "confidence":{"type":"string","enum":["high","medium","low"]}
  },"required":["subject_name","date_raw","confidence"]}},
  "exam_name":{"type":["string","null"]},
  "warnings":{"type":"array","items":{"type":"string"}}
}, "required":["exams"] }
```
Do not ask for name, enrolment number or photo in the schema. That keeps the model from returning personal data.

### Gaps
- I have no exact current free-tier RPM/RPD for the Gemini 3.x Flash and Flash-Lite models; it is per project in AI Studio.
- I have no measured accuracy figures on Indian admit cards. Run your own evaluation on 20 or more cards.
- The model names (3.8 Flash and so on) come from the October 2026 pricing page. Check them again at build time.

## 3. Option B: client-side OCR (Tesseract.js) or pdf.js text extraction, then rules or a cheaper LLM

### Takeaway
For text-based PDFs, pdf.js `getTextContent()` gives exact text with x/y positions for free and nothing leaves the device. It is the best first pass. Tesseract.js works on photos in the browser, but it cannot read PDFs and is clearly less accurate on skewed or low-light phone photos. Treat it as an offline or privacy fallback, not the primary path.

### Cited Findings
- pdf.js `getTextContent()` returns positioned items `{ str, transform, width, height }` for each glyph run, derived from the PDF's text paint operators. Advance widths are typographic, not ink widths. Tables can also be rebuilt from the structure tree in tagged PDFs, or by using column rule lines — [DEV: three-tier PDF extraction with PDF.js](https://dev.to/bonzai2carn/the-three-tier-pdf-extraction-model-demystifying-pdfjs-52bc)
- That article scopes itself to "manufactured" (not scanned) PDFs. A scanned PDF has no text operators, so `getTextContent()` returns nothing useful — [DEV article](https://dev.to/bonzai2carn/the-three-tier-pdf-extraction-model-demystifying-pdfjs-52bc) (the inference about scanned PDFs is mine, consistent with how PDF text layers work)
- Tesseract.js (v7 current; needs Node 16+ on the server side) runs in the browser and in Node and supports 100+ languages. "Tesseract.js does not support PDF files"; the README suggests Scribe.js instead. It wraps the WASM Tesseract engine without changing its recognition model, so accuracy is plain Tesseract. It has auto-rotate preprocessing. Reuse one worker across images. The README does not mention React Native — [Tesseract.js GitHub](https://github.com/naptha/tesseract.js)

### Inferences
- Recommended rule parser after pdf.js or OCR text:
  - Group items into lines by y-coordinate (with a tolerance), then sort by x.
  - Subject code regex: `\b[A-Z]{2,5}[- ]?\d{3,6}[A-Z]?\b` (covers CSC301, 3150703 for GTU-style numeric codes if extended with `\b\d{6,7}\b`, 203105201). Tune per university.
  - Date regexes: `\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b` with optional `\(?(Mon|Tue|...|MONDAY...)\)?`; also `\d{1,2}[- ](Jan|Feb|...)[- ]\d{2,4}`. Always read as DD/MM in India. Use the weekday, when present, to check the date (if "21/10/2026 (Wed)" does not fall on a Wednesday, flag it). Expand 2-digit years.
  - Time: `(\d{1,2})[:.](\d{2})\s*(AM|PM|A\.M\.|P\.M\.)?\s*(to|-|–|—)\s*(\d{1,2})[:.](\d{2})\s*(AM|PM)?`. Map session words (Morning/Forenoon/FN, Afternoon/AN, Evening) to defaults only if no explicit time is given, and flag those rows.
  - Use a library such as date-fns `parse` with an explicit `dd/MM/yyyy` format. Never rely on `new Date(str)`, which assumes US MM/DD.
- Hybrid: send the pdf.js text (personal fields removed by regex or line filtering) to a cheap text-only LLM call (Flash-Lite) to structure it. That costs fewer tokens than an image, keeps the photo off any server, and handles odd layouts better than regex alone.
- Tesseract.js downloads the language model on first run (several MB) and is slow on low-end Android phones. Fine for a web PWA, heavier for React Native (needs a WebView or native OCR such as ML Kit; not verified here).

### Gaps
- I found no benchmark comparing Tesseract.js and Gemini accuracy on phone photos of Indian hall tickets.
- I did not verify React Native support for Tesseract.js, or the on-device ML Kit text recognition alternative.

## 4. Option C: Google Cloud Vision, Document AI, Azure Document Intelligence free tiers

### Takeaway
Cloud OCR is more accurate than Tesseract on photos, and Cloud Vision's 1,000 free units a month is enough for an MVP. But these services only return raw text or layout, so you still need a parser or LLM step. Azure's free tier only analyses the first 2 pages of each document. Document AI has no permanent free tier.

### Cited Findings
- Google Cloud Vision Text / Document Text Detection: the first 1,000 units a month are free, then $1.50 per 1,000 units (up to 5M), then $0.60 per 1,000. Each PDF page is billed as its own image — [Cloud Vision pricing](https://cloud.google.com/vision/pricing)
- Google Document AI: Enterprise Document OCR $1.50 per 1,000 pages (to 5M per month); Form Parser $30 per 1,000; Layout Parser $10 per 1,000; Custom Extractor $30 per 1,000. There is no Document AI free tier, only general Google Cloud new-customer credits ($300) — [Document AI pricing](https://cloud.google.com/document-ai/pricing)
- Azure AI Document Intelligence F0 (free): 0–500 pages a month (pricing page) — [Azure DI pricing](https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/). F0 limits: 4 MB maximum document, only the first 2 pages of each request analysed, 1 TPS, not adjustable — [Azure DI service limits](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/service-limits)
- The Azure pricing page showed blank "$-" placeholders for paid per-page rates when fetched, so I could not confirm paid S0 rates — [Azure DI pricing](https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/)

### Inferences
- For ExamPilot, Option C adds a vendor and still needs a structuring step. Gemini does OCR and structuring in one call for less than the price of Vision OCR alone. Option C only makes sense if you want a non-generative OCR for audit or determinism reasons.
- The Azure F0 2-page cap is fine for most admit cards (usually 1 page), but 1 TPS limits bursts at exam season.

### Gaps
- Azure paid rates were not visible. I found no published accuracy comparison for Indian documents.

## 5. Text PDFs vs scanned images, and date/time quirks

### Takeaway
Detect the input type first. If pdf.js returns enough text containing date-like tokens, use the text path. Otherwise (scanned PDF, JPG/PNG/HEIC photo or screenshot) use the vision path. Then normalise every date as DD/MM in code, check it against the printed weekday, and flag anything ambiguous.

### Cited Findings
- Sample real-world format: "02/06/2026, TUESDAY" and "02:30 PM to 05:30 PM" — [SIES GST hall ticket](https://siesgst.edu.in/docs/exam/AIML%20SEM%20III%20R-19%20KT.pdf)
- Gemini processes PDF pages as images with native vision and extracts embedded text on Gemini 3 models; it advises upright, non-blurry pages — [Gemini docs](https://ai.google.dev/gemini-api/docs/document-processing?authuser=1)

### Inferences
- Detection heuristic: run pdf.js over all pages. If the text is under about 50 characters, or no date regex matches, treat it as scanned. Also check `file.type`: image/* goes straight to the vision path.
- Image preprocessing before upload: fix EXIF orientation, downscale to about 2000 px on the long edge (the upload stays small and Gemini's cap is 3072), convert HEIC to JPEG, and optionally crop in an interactive crop UI so the photo or candidate block can be excluded.
- Quirks to handle (from experience with Indian formats; not exhaustively sourced):
  - DD-MM-YYYY, DD/MM/YY and DD.MM.YYYY
  - "21/10/2026 (Wed)" and "21-Oct-2026"
  - Weekday in capitals
  - "Afternoon 2:00–5:00" with no AM/PM, where the session word implies PM
  - FN/AN abbreviations
  - En-dash and "to" ranges
  - 24-hour times ("14:00-17:00")
  - Practical exams with a date range or "As per schedule"
  - Rows split across lines
  - Several tickets per page, giving duplicate rows to dedupe
  - Code and name in one cell
- Validation rules:
  - The date must be in the future, or within the current exam window.
  - The weekday must match the date.
  - The end time must be after the start time, and the duration should be 1 to 4 hours.
  - No two exams in the same slot (flag clashes).
  - If the year is missing, infer it from the exam-session label or the nearest future date, and flag the row.

### Gaps
- I have no sourced catalogue of each university's format. Build one from user uploads (with consent) or public PDFs.

## 6. UX: confirm/edit before saving, with confidence flags

### Takeaway
Never write extracted exams straight to the calendar. Show an editable review table, pre-filled, with low-confidence or invalid fields highlighted. Save only after the student taps "Confirm".

### Cited Findings
- Gemini's own docs warn that structured output is syntactically valid but may be semantically wrong, and that apps must validate values — [Gemini structured output docs](https://ai.google.dev/gemini-api/docs/structured-output)
- The Gemini terms note that free-tier output is reviewed and processed; Google gives no accuracy guarantees — [Gemini API terms](https://ai.google.dev/gemini-api/terms)

### Inferences (product recommendations; no external UX source collected)
- Review screen: one card or row per exam, with Subject code, Subject name, Date (date picker), Start/End (time pickers), Session. Show the raw extracted text under each field ("from card: 02/06/2026, TUESDAY") so the student can spot errors.
- Confidence flags: combine the model's self-reported confidence with deterministic checks (weekday mismatch, missing year, missing time, unusual code pattern, duplicate). Show amber for "please check" and red for "missing or invalid". Turn off "Save" until every red field is fixed.
- Let the student add or delete rows, and "match to my subjects" (link to existing ExamPilot subjects by code).
- Optionally show a thumbnail of the uploaded card side by side, held in memory only, for checking.
- After confirming, offer "Add to Google Calendar / download .ics", and explicitly "Delete uploaded card now" (the default).
- Track edit rates per field, without personal data, to measure extraction accuracy over time.

### Gaps
- I collected no published UX research on document-extraction review screens; the above is best-practice reasoning.

## 7. Privacy: DPDP Act 2023 and DPDP Rules 2025

### Takeaway
ExamPilot is a Data Fiduciary for admit-card data. It needs a clear standalone notice, purpose-specific consent, reasonable security (encryption, access control, logging), erasure once the purpose is served, and verifiable parental consent for users under 18. The cleanest compliance posture is extract and discard: keep only the confirmed timetable rows and delete the image or PDF immediately.

### Cited Findings
- MeitY notified the DPDP Rules, 2025 on 13 November 2025. Phased start: Rules 1, 2 and 17–21 immediately; Rule 4 (Consent Managers) from 13 Nov 2026; Rules 3, 5–16 and 22–23 (notice, security, breach, erasure, children and so on) from 13 May 2027 — [SCC Online, MeitY notified DPDP Rules 2025](https://www.scconline.com/blog/post/2025/11/14/meity-notified-digital-personal-data-protection-rules-2025/)
- Rule 3 notice must be "clear, independent, and accessible". It must list the personal data, the purposes, and how to withdraw consent, exercise rights and complain — [SCC Online](https://www.scconline.com/blog/post/2025/11/14/meity-notified-digital-personal-data-protection-rules-2025/)
- Rule 6 minimum security: encryption, masking or tokenisation; access controls; logging and monitoring; backups; keeping logs for one year; processor contracts that require safeguards — [SCC Online](https://www.scconline.com/blog/post/2025/11/14/meity-notified-digital-personal-data-protection-rules-2025/)
- Breach: notify affected Data Principals promptly, and give the Board an initial description followed by a detailed report within 72 hours — [SCC Online](https://www.scconline.com/blog/post/2025/11/14/meity-notified-digital-personal-data-protection-rules-2025/)
- Erasure: delete once the purpose is no longer served (Third Schedule timelines, which apply to specified large classes), with 48 hours' notice before erasure in those cases. The Seventh Schedule requires keeping personal data and associated logs for at least one year — [SCC Online](https://www.scconline.com/blog/post/2025/11/14/meity-notified-digital-personal-data-protection-rules-2025/)
- Rule 10: verifiable parental consent before processing a child's data, confirming the parent is an adult (via details already held, voluntarily provided, or a virtual token from an authorised entity) — [SCC Online](https://www.scconline.com/blog/post/2025/11/14/meity-notified-digital-personal-data-protection-rules-2025/)
- The Act defines a child as under 18. Fiduciaries must process data only for a lawful purpose with consent after notice, allow withdrawal, keep data accurate, keep reasonable safeguards, report breaches to the Board and affected persons, and erase data once the purpose is fulfilled. Principals have rights to information, correction, erasure, nomination and grievance redressal. Maximum penalties: up to ₹250 crore for failing to take security safeguards, and up to ₹200 crore for breaching children's-data obligations — [PRS India DPDP Bill 2023 summary](https://www.prsindia.org/files/bills_acts/bills_parliament/2023/Summary_Digital_Personal_Data_Protection_Bill_2023.pdf)
- Further summaries — [EY: DPDP Rules 2025](https://www.ey.com/en_in/insights/cybersecurity/transforming-data-privacy-digital-personal-data-protection-rules-2025), [IIT BHU DPDP Act and Rules summary (PDF)](https://iitbhu.ac.in/contents/institute/cf/cis/doc/dpdp_act_rules_summary.pdf)

### Inferences
- Timing: the core obligations (notice, security, erasure, children) take effect on 13 May 2027, about 7 months away. Build to them now; retrofitting is harder.
- There is a tension in the Seventh Schedule's one-year log retention. My reading is that it applies to processing logs and records, so keep a minimal audit log (user ID, timestamp, "admit card processed and deleted"), not the card itself. I did not verify this reading against the Rules text; get a lawyer to confirm.
- Recommended posture:
  1. Show a just-in-time notice on the upload screen: "We'll read your exam dates from this card. The file is deleted right after you confirm. Your name and photo aren't stored." Add a consent checkbox and a link to the privacy policy.
  2. Process in memory or in a short-lived temporary object. Delete the original right after extraction. If a server copy is ever needed (retry), use a private bucket with a TTL lifecycle rule (for example 24 hours) and server-side encryption.
  3. Store only the confirmed exam rows. Treat seat number and centre as optional fields the user chooses to keep.
  4. Do not send cards to the Gemini free tier. Its terms say inputs may be human-reviewed and used for training, and it explicitly warns against personal information. Use the paid tier, which Google's DPA covers, and list Google as a processor in the privacy notice.
  5. Many first-year students are 17. Add an age gate and a verifiable parental-consent flow, or restrict uploads to 18+ until that exists.
  6. Provide in-app "Delete my data" and "Withdraw consent" controls, and a grievance contact.
  7. If a user chooses to keep the card for exam day, encrypt it client-side or rely on bucket encryption plus strict per-user access rules, and auto-delete it after the last exam date.

### Gaps
- I did not read the full Rules text (e.g., on meity.gov.in) directly; the summaries above come from SCC Online, PRS and EY.
- It is unclear whether a small student app falls under Third Schedule erasure timelines, which target specified classes such as large e-commerce, gaming and social media platforms.
- The treatment of facial photos (are they biometric?) under DPDP is not specifically addressed in the sources gathered.

## 8. File storage: Firebase Storage vs Supabase Storage free tiers

### Takeaway
Firebase Storage now requires the Blaze (pay-as-you-go) plan, even to use the free quota. Supabase's free plan includes 1 GB storage and 50 MB uploads with no card required, but free projects pause after a week of inactivity. With extract-and-discard, ExamPilot barely needs storage either way.

### Cited Findings
- Firebase: Cloud Storage for Firebase "now requires projects to be on the pay-as-you-go Blaze pricing plan", including default buckets (change announced September 2024). Spark projects get 402/403 errors. New buckets (`*.firebasestorage.app`) follow Google Cloud Storage pricing with an "Always Free" tier in US-CENTRAL1, US-EAST1 and US-WEST1 only — [Firebase storage changes FAQ](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024?authuser=4)
- Firebase pricing page: on Blaze, `*.firebasestorage.app` buckets get 5 GB-months stored, 100 GB a month downloaded, 5K uploads a month and 50K downloads a month free (in eligible regions). Legacy `*.appspot.com` buckets keep 5 GB stored, 1 GB a day downloaded, 20K uploads a day and 50K downloads a day. The Spark column is marked "Not applicable" for Storage — [Firebase pricing](https://firebase.google.com/pricing)
- Supabase Free: 1 GB storage, 50 MB maximum file upload, 5 GB egress, 2 active projects, pauses after 1 week of inactivity. Pro from $25 a month with 100 GB storage — [Supabase pricing](https://supabase.com/pricing)

### Inferences
- If ExamPilot already uses Firebase Auth/Firestore: upgrade to Blaze with a budget alert. Small usage stays free, but the free Storage quota only covers US regions, which adds latency and data-residency questions for Indian users. A Cloud Function (also Blaze-only, not verified here) can take the upload in the request body, call Gemini, and never persist the file. That avoids Storage entirely.
- If ExamPilot uses Supabase: an Edge Function can take the file and call Gemini with no storage. If temporary storage is needed, use a private bucket with RLS so users only see their own folder, plus a scheduled cleanup job. Free-tier pausing is a real risk for a production app; budget for Pro ($25 a month) at launch.
- Neither free tier is the deciding factor once you discard the file. Choose by the rest of the backend.

### Gaps
- I did not verify whether Firebase Storage supports Mumbai (asia-south1) in the Always Free regions; the FAQ lists US regions only. I also did not check the Supabase free-plan region choice for India (ap-south-1 is generally available; unverified here).

## Recommended pipeline (synthesis)

1. Client: the student picks a PDF or image, or takes a photo. Show the consent notice. Check age (under 18 needs the parental-consent flow).
2. Client, PDF only: run pdf.js `getTextContent()`. If good text with dates is found, strip lines matching name, enrolment, seat or father's-name labels, and send only the text to the server. If not, render the page to an image (pdf.js canvas) and use the image path.
3. Client, image: fix orientation, downscale to about 2000 px, convert to JPEG, and optionally crop to the timetable.
4. Server function (Firebase or Supabase), with the key kept secret: call Gemini Flash-Lite (paid tier, spend cap) with a JSON schema that excludes personal fields, temperature 0. Fall back to Flash if validation fails. No persistence; process in memory.
5. Server: validate and normalise in code (DD/MM parsing, weekday check, time ranges, duplicates, clashes). Attach per-field flags.
6. Client review screen: editable rows, with flags highlighted and raw strings shown. The student confirms.
7. Save only the confirmed exam rows to the database. Discard the file and log "processed/deleted". Offer .ics or Google Calendar export.
8. Offline or free fallback: Tesseract.js plus the regex parser in the browser, with every field marked "please verify".
9. Evaluation: build a set of 20 to 50 real cards (with consent, redacted) across universities, and track field-level accuracy and user edit rates.
