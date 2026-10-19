/**
 * ExamPilot AI proxy (see /server). Leave AI_URL empty to run the offline assistant only.
 * The Gemini key lives on the server, never here. AI_TOKEN only deters casual misuse of the
 * endpoint; anyone with the app binary can read it.
 */
export const AI_URL = 'https://exampilot-ai-phi.vercel.app/api/ai';
export const AI_TOKEN = '40661eae9cfc205dce9451b6701be0ec1453561ef99487f4';
