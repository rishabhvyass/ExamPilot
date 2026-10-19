# ExamPilot AI proxy

One Vercel Function (`api/ai.ts`) that calls Google Gemini so the API key never ships in the app.

## Deploy
```bash
cd server
vercel login
vercel link                      # create / pick the project
vercel env add GEMINI_API_KEY    # paste the key from https://aistudio.google.com/apikey
vercel env add APP_TOKEN         # any long random string; also put it in mobile/src/config/ai.ts
vercel --prod
```
Optional: `GEMINI_MODEL` (default `gemini-3.8-flash`).

Then set `AI_URL` in `mobile/src/config/ai.ts` to `https://<project>.vercel.app/api/ai`.
