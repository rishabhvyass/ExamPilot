# Free / Free-Tier LLM APIs for the ExamPilot Study Assistant (state as of 18 Oct 2026)

Research date: 2026-10-18. "Page date" means the "last updated" stamp on the source page when one was shown. Pages without a stamp are marked "undated". Items from background knowledge that I could not re-verify this session are marked **[unverified]**.

Model names such as "Gemini 3.8 Flash", "qwen3.8-27b" and "gpt-oss-120b" are copied exactly from the live October 2026 pages.

---

## 1. Which providers have a real free tier today? (models, limits, card, India, training, commercial use)

### Takeaway
Only a few options are permanently free with no card and are usable for a production MVP:
- **Google Gemini API free tier**: the most capable option, but Google no longer publishes the free limits.
- **Groq free plan**: published limits of about 1K requests per day per model.
- **Cloudflare Workers AI**: 10,000 Neurons per day.
- **OpenRouter `:free` models**: 50 requests per day, or 1,000 per day after a one-time purchase of 10 credits.

The others are not good production options:
- Cerebras is now only a 30-day $5 trial.
- Hugging Face gives free users no monthly credits.
- GitHub Models and the Cohere trial are explicitly for experimentation.
- Mistral's free "Experiment" plan needs phone verification and may train on your requests.

### Cited Findings

**Google Gemini API (AI Studio)**
- Free tier per the pricing page (fetched 2026-10-18):
  - Free: Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite, 3 Flash Preview, plus the Live, TTS and Transcribe models.
  - Paid only: Gemini 4 Argon, 3.1 Pro Preview, Gemini Omni Flash, and all image models.
  - Free-tier data is "Used to improve our products: Yes". Paid tier: "No". — [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- The rate-limits page (updated 2026-10-15) gives **no numbers** for the free tier. It says limits depend on usage tier and can be viewed per project in AI Studio. Other details from the page:
  - Limits apply per project, not per API key.
  - RPD resets at midnight Pacific time.
  - Preview and experimental models have tighter limits.
  - Moving to Tier 1 needs billing set up. — [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- History of free-tier cuts (secondary source, which has internal date inconsistencies):
  - 2025-12-06: free Gemini 2.5 Flash fell from 10 RPM / 250 RPD to **5 RPM / 20 RPD**, 2.5 Pro lost free access, and Google stopped publishing free limits.
  - 2026-04-01: monthly spend caps started.
  - 2026-09-18: new projects are steered to 3.5 Flash-Lite and 3.8 Flash.
  - This source also lists Gemini Embedding 2 and Gemma 4 as free. — [agentdeals.dev](https://agentdeals.dev/gemini-api-pricing-changes)
- Another third-party guide (updated 2026-09-30) also says there is no official per-model free table now. It quotes only old community figures: about 20 RPD for 2.5 Flash in Dec 2025, and third-party tables in Jan 2026 showing 5–15 RPM, 250K TPM and 100–1,000 RPD. — [yingtu.ai](https://yingtu.ai/en/blog/google-gemini-api-free-tier-limits-2026)
- Terms (updated 2026-04-28, effective 2026-03-23):
  - **Unpaid Services:** Google can use prompts and responses to improve its products and ML. Human reviewers may read them after the data is disconnected from your account. Google says "Do not submit sensitive, confidential, or personal information to the Unpaid Services."
  - Apps made available to users in the EEA, UK or Switzerland must use Paid Services.
  - **Users must be 18 or older.** API clients "directed at or likely accessed by people under 18" are not permitted. — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
- **India is a supported region** (page updated 2026-04-28). — [Available regions](https://ai.google.dev/gemini-api/docs/available-regions)
- No credit card is needed for the free tier, which qualifies via an "Active project". — [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) (card point **[unverified]**: the page says billing is needed only to *upgrade*)

**Groq**
- The rate-limits page is undated. Its table header reads "Free Plan Limits / Developer Plan Limits", but the text says the figures shown are the Developer plan's base limits. Free-plan limits are shown per account at console.groq.com/settings/limits. Listed limits:

  | Model | RPM | RPD | TPM | TPD |
  |---|---|---|---|---|
  | openai/gpt-oss-120b | 30 | 1K | 8K | 200K |
  | openai/gpt-oss-20b | 30 | 1K | 8K | 200K |
  | qwen/qwen3.8-27b | 30 | 1K | 8K | 200K |
  | whisper-large-v3 | 20 | 2K | – | – |

  Whisper is also capped at 7.2K audio-seconds per hour. — [Groq rate limits](https://console.groq.com/docs/rate-limits)
- Data handling:
  - By default Groq does not retain inference inputs or outputs.
  - Data may be logged for up to 30 days for reliability and abuse monitoring.
  - **All customers** can enable Zero Data Retention.
  - The page does not state a training policy. — [Groq Your Data](https://console.groq.com/docs/your-data)
- No credit card is needed for the free plan. **[unverified]**

**OpenRouter (`:free` models)**
- `:free` models are limited to **20 RPM**.
- Daily cap: **50 requests per day** if you have bought fewer than 10 credits in total, or **1,000 per day** after buying at least 10 credits. — [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits)
- Free models listed on 2026-10-18:
  - XingChen Xing4.0 29B A4B: 262K context, tool calling.
  - NVIDIA Nemotron 3.5 Super VL: 1M context, tool use.
  - Neither is explicitly marked as supporting structured outputs. The free list rotates. — [OpenRouter models, max_price=0](https://openrouter.ai/models?max_price=0)
- Training:
  - Account settings have separate opt-ins for free and paid models controlling routing to providers that may train on prompts.
  - Per-provider policies vary.
  - The page does not guarantee free endpoints are training-free. — [OpenRouter logging/privacy](https://openrouter.ai/docs/guides/privacy/logging)

**Cerebras**
- **There is no permanent free tier.** The Free Trial gives **$5 in credits that expire after 30 days**.
- Trial limits for gpt-oss-120b and qwen-3.8-27b: 5 RPM, 30K uncached TPM, 1M TPH, 1M TPD.
- The page is undated. — [Cerebras rate limits](https://inference-docs.cerebras.ai/support/rate-limits)

**Cloudflare Workers AI**
- **10,000 Neurons per day free** on both the Workers Free and Paid plans. Above that, Paid plans cost $0.011 per 1,000 Neurons. The free allocation resets at 00:00 UTC, and requests error once it is used up.
- Example costs in Neurons per 1M tokens:

  | Model | Input | Output |
  |---|---|---|
  | llama-3.1-8b-instruct-fp8-fast | 4,119 | 34,868 |
  | llama-3.3-70b-fp8-fast | 26,668 | 204,805 |
  | gpt-oss-20b | 18,182 | 27,273 |
  | gpt-oss-120b | 31,818 | 68,182 |

- Embeddings: bge-m3 costs 1,075 Neurons per 1M input tokens, bge-base-en-v1.5 costs 6,058. — [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)

**Mistral (La Plateforme, "Experiment" plan)**
- Free. Needs a **verified phone number** (one per plan) and **no credit card**.
- **API requests under Experiment may be used to train Mistral's models.**
- The help article does not list limits or models and is dated only "Updated over a month ago". — [Mistral help](https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan)
- The tier docs describe the free tier only as having "restrictive rate limits" (requests per second and tokens per minute/month). Numbers are shown in console.mistral.ai/limits. — [Mistral tiers](https://docs.mistral.ai/deployment/laplateforme/tier/)

**Hugging Face Inference Providers**
- Free users get **no monthly credits**. PRO users get $2 per month.
- All users can go beyond included credits by buying credits. — [HF pricing](https://huggingface.co/docs/inference-providers/pricing)

**GitHub Models (Copilot Free)**
- Copilot Free limits:

  | Tier | RPM | RPD | Tokens per request | Concurrency |
  |---|---|---|---|---|
  | Low | 15 | 150 | 8K in / 4K out | 5 |
  | High | 10 | 50 | 8K in / 4K out | 2 |
  | Embedding | 15 | 150 | 64K | 5 |

- The free limits are "intended to help you get started with experimentation", which rules them out for production. — [GitHub Models docs](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models)

**Cohere (trial key)**
- Trial limits: Chat 20 requests/min, Embed 2,000 inputs/min, Rerank 10 requests/min, and **1,000 API calls per month** in total.
- Trial keys are "evaluation keys". Production keys are paid. — [Cohere rate limits](https://docs.cohere.com/docs/rate-limits)

**NVIDIA NIM (build.nvidia.com)**
- Developer forum threads from 2026 show the default is **40 RPM** with **1,000 credits**. Users ask for 200 RPM / 5,000 credits, and NVIDIA says increases are not granted through forum requests.
- These are forum posts, not official docs. — [NVIDIA forum](https://forums.developer.nvidia.com/t/api-rate-limit-increase-is-not-granted-by-requesting-it-here/368420); [example request](https://forums.developer.nvidia.com/t/credit-rate-limit-increase-request-1-000-5-000-credits-40-200-rpm/379108)
- NVIDIA's API trial terms prohibit production use. **[unverified]**

### Inferences
- **The Gemini 18+ clause matters for ExamPilot.** Most B.Tech students are 18 or older, but some first-years are 17. An app "likely accessed by people under 18" technically breaches the free (and paid) Gemini API terms. ExamPilot should add an 18+ gate in its terms or onboarding, or the final report should flag this as a risk.
- The Gemini free tier may use student notes and PDFs for training, and humans may review them. The app's privacy notice should disclose this. Students should be warned not to upload personal data, or the app should use Groq (no retention by default, ZDR available) for document Q&A.
- Gemini's free limits are unpublished and were cut sharply in Dec 2025. Do not hard-code capacity. Read 429 responses and fall back to another provider.
- Only Gemini and Groq are realistically production-capable at no cost. Cloudflare Workers AI is a solid third option because it lives in the same place as the proxy.

### Gaps
- Exact current Gemini free RPM, TPM and RPD for 3.8 Flash and 3.5 Flash-Lite. Google does not publish them, so the developer must check the AI Studio rate-limit page for their project.
- Groq: whether the published 1K RPD / 200K TPD figures are the Free plan or Developer plan numbers. The page is ambiguous.
- Mistral Experiment plan: numeric limits and model list (shown only in the console).
- Groq and Cloudflare commercial-use terms on the free tier were not checked.
- Whether free models are available in India was confirmed only for Gemini. The others are global APIs with no stated India restriction found.

---

## 2. Structured output / JSON schema / function calling (study plan + chart JSON)

### Takeaway
Gemini (3.8 Flash and the other Gemini 3 models) supports strict JSON-Schema structured output and function calling. It is the best fit for generating plan and chart JSON. Groq supports strict JSON Schema on gpt-oss-20b/120b and qwen3.8-27b, but **not together with streaming or tool use**. OpenRouter's free models advertise tool calling but not structured outputs.

### Cited Findings
- **Gemini:**
  - Output can be forced to "adhere to a provided JSON Schema".
  - The JS SDK accepts Zod schemas.
  - Gemini 3 models can combine Structured Outputs with built-in tools including Function Calling. This combination is in preview and Gemini 3 only.
  - Page updated 2026-10-13. — [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- **Gemini 3.8 Flash** (`gemini-3.8-flash`, stable, updated September 2026):
  - Supports structured outputs, function calling, file search, caching, thinking, code execution, and URL context.
  - 1,048,576 input tokens and 65,536 output tokens. — [Gemini 3.8 Flash model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash)
- **Groq:**
  - Strict mode (`strict: true`) works on gpt-oss-20b, gpt-oss-120b, qwen/qwen3.8-27b and meta-models/muse-spark-open.
  - `json_object` mode works on all models, but it guarantees valid JSON syntax only, not schema adherence.
  - "Streaming and tool use are not currently supported with Structured Outputs."
  - Strict mode requires every field to be `required` and `additionalProperties: false`. — [Groq structured outputs](https://console.groq.com/docs/structured-outputs)
- **OpenRouter:** the free models on 2026-10-18 list tool calling. Neither is labelled as supporting structured outputs. — [OpenRouter models](https://openrouter.ai/models?max_price=0)
- **Cloudflare Workers AI:** supports a JSON mode (`response_format` with a JSON schema) on some models. **[unverified]**: the pricing page fetched did not mention it.

### Inferences
- Use two separate calls:
  1. A **non-streaming** structured call that returns the plan: an array of `{date, subject, topic, minutes}` objects plus a per-subject hours summary for the charts.
  2. A **streaming**, free-text call for chat.

  This fits Groq's limitation too.
- Validate the JSON on the server (for example with Zod) and retry once on failure. This matters especially for any fallback that only offers `json_object` mode.

### Gaps
- Verified structured-output support for specific Workers AI models.

---

## 3. Long context, PDF input and embeddings ("chat with my notes")

### Takeaway
Gemini is far ahead for notes and PDFs:
- 1M-token context.
- Native PDF input up to 1,000 pages or 50 MB.
- A free Files API.
- Embedding models, including the multimodal `gemini-embedding-2`.
- A File Search tool.

For a small MVP, the simplest approach is to send the PDF to Gemini directly (long context). RAG with embeddings (Gemini embeddings or Cloudflare bge-m3 + Vectorize) can come later.

### Cited Findings
- **Gemini PDF input:**
  - Up to 1,000 pages and 50 MB per PDF, inline or via the Files API.
  - 258 tokens per page.
  - The Files API stores files for **48 hours** and is free.
  - For Gemini 3 models, tokens from text natively embedded in the PDF are not charged.
  - Page updated 2026-10-08. — [Gemini document processing](https://ai.google.dev/gemini-api/docs/document-processing)
- **Gemini 3.8 Flash:** 1,048,576-token input. Accepts PDF, image, audio and video. Supports file search and context caching. — [model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash)
- **Gemini embeddings** (page updated 2026-10-09):
  - `gemini-embedding-2`: 8,192 input tokens; 128–3072 dimensions (768 / 1536 / 3072 recommended); accepts text, image, video, audio and PDF.
  - `gemini-embedding-001`: text only, 2,048 tokens.
  - The two embedding spaces are incompatible.
  - The page does not state whether they are on the free tier. — [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
  - A secondary source lists Gemini Embedding 2 as free. — [agentdeals.dev](https://agentdeals.dev/gemini-api-pricing-changes)
- **Cloudflare embeddings** (Neurons per 1M input tokens): bge-m3 1,075, bge-small-en-v1.5 1,841, bge-base-en-v1.5 6,058. These count against the 10K free Neurons per day. — [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- **GitHub Models** has an embedding tier (15 RPM / 150 RPD / 64K tokens) but is for experimentation only. — [GitHub Models](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models)
- **Cohere trial** offers Embed at 2,000 inputs/min and Rerank, within the 1,000 calls per month cap. — [Cohere](https://docs.cohere.com/docs/rate-limits)
- **Groq** has no PDF input. Its rate-limit table lists no embedding models. — [Groq rate limits](https://console.groq.com/docs/rate-limits)
- **Gemini grounding:** for Gemini 3.x, Google Search grounding is not free on the free tier (secondary source). The pricing page shows free grounding at 500 RPD only for the 2.5 models. — [agentdeals.dev](https://agentdeals.dev/gemini-api-pricing-changes); [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Inferences
- **Free-tier token cost of a whole PDF:** a 100-page notes PDF is about 25.8K tokens (258 per page). This is cheap in context but uses up a TPM budget fast.
  - With the limits shown on Groq's rate-limit page (8K TPM), whole-PDF prompts are impossible on Groq. Groq would need RAG over small chunks.
- **Re-uploads:** Files API storage lasts 48 hours, so ExamPilot must store the original PDF itself (for example in Supabase Storage or Firebase Storage) and re-upload when needed. Alternatively, extract the text once, chunk it, and embed it.

### Gaps
- Whether Gemini File Search (managed RAG) is free on the free tier.
- Free-tier embedding RPD for Gemini.

---

## 4. Architecture: keep keys out of the frontend; free serverless proxies

### Takeaway
Any API key shipped in a React or React Native bundle can be extracted and abused, which would burn the shared free quota or run up a bill. Calls must go through a server-side proxy that holds the key, checks the user (for example with a Supabase or Firebase auth JWT), and rate-limits per student. Free options:
- **Cloudflare Workers:** 100K requests per day, and Workers AI is on the same platform.
- **Supabase Edge Functions:** 500K invocations per month.
- **Firebase AI Logic:** a managed Gemini proxy with App Check.
- **Vercel / Netlify functions.**

### Cited Findings
- **Firebase AI Logic:**
  - Its client SDKs send requests through a proxy so "your Gemini API key stays on the server".
  - App Check blocks unauthorized clients.
  - Per-user rate limits are on by default and configurable.
  - Page updated 2026-10-14. — [Firebase AI Logic](https://firebase.google.com/docs/ai-logic)
- **Cloudflare Workers Free:**
  - 100,000 requests per day; over the limit returns error 1027.
  - 10 ms CPU per request. Time spent waiting on the network (such as the LLM call) does not count.
  - 50 subrequests per invocation. — [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- **Supabase Edge Functions Free:**
  - 500,000 invocations per month. — [Supabase functions pricing](https://supabase.com/docs/guides/functions/pricing)
  - 2 s CPU per request (async I/O not counted), 150 s wall clock per worker, up to 100 functions. — [Supabase functions limits](https://supabase.com/docs/guides/functions/limits)
- **Vercel Hobby:** the limits page is dated 2026-09-16. The fetch did not return the Hobby invocation and duration figures. Hobby is restricted to non-commercial/personal use under Vercel's fair-use terms. **[unverified this session]** — [Vercel limits](https://vercel.com/docs/limits)
- **Gemini quotas are per project, not per key**, so all students share one quota pool. — [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)

### Inferences
- **Recommended stack for a solo developer:**
  - Supabase (auth + Postgres + Storage + pgvector + Edge Functions), with the Edge Function calling Gemini and falling back to Groq.
  - Or Cloudflare Workers + Workers AI + Vectorize as an all-Cloudflare option.
  - Keep keys in function secrets.
  - Enforce per-user daily caps in the database, for example 20 chat messages and 3 plan regenerations per day.
- **Streaming:** SSE streaming through a Worker or Edge Function works without using up CPU limits, because I/O wait is excluded.

### Gaps
- Netlify Functions free limits and exact Vercel Hobby numbers were not verified.
- Firebase Spark plan compatibility with AI Logic plus the free Gemini Developer API was not confirmed.

---

## 5. Recommended MVP pick, fallback, and rough capacity

### Takeaway
- **Primary:** Gemini 3.8 Flash, or 3.5 Flash-Lite for cheap chat. It covers chat, JSON-schema plans, PDF Q&A and embeddings.
- **Fallback:** Groq gpt-oss-120b / qwen3.8-27b (strict JSON, fast).
- **Tertiary:** Cloudflare Workers AI or OpenRouter `:free`.

Expect the free tiers to serve only **tens of active students per day**, not hundreds. Plan on enabling Gemini Tier 1 billing (which also stops free-tier training use) once the app has real users.

### Cited Findings (inputs to the estimate)
- Groq gpt-oss-120b: 1K RPD and 200K TPD per model (plan applicability ambiguous). — [Groq](https://console.groq.com/docs/rate-limits)
- Cloudflare: 10K Neurons per day. gpt-oss-120b costs 31,818 in / 68,182 out Neurons per 1M tokens; llama-3.1-8b-fast costs 4,119 / 34,868. — [CF pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- OpenRouter free: 50 RPD, or 1,000 RPD after a one-time purchase of 10 credits. — [OpenRouter](https://openrouter.ai/docs/api-reference/limits)
- Gemini free: unpublished. The last public data point was 20 RPD for 2.5 Flash (Dec 2025, secondary). — [agentdeals.dev](https://agentdeals.dev/gemini-api-pricing-changes)

### Inferences (my arithmetic, not sourced figures)
These estimates assume one chat turn is about 1.5K tokens and one plan generation is about 4K tokens (2K in, 2K out).
- **Groq, one model:** the 200K TPD cap is the binding limit. That is about 130 chat turns or about 50 plans per day. Using two models (gpt-oss-120b + qwen3.8-27b) roughly doubles this, to about 15–25 students at 10 turns each.
- **Cloudflare, gpt-oss-120b, 2K in / 1K out:** about 132 Neurons per call, so about 75 calls per day. With llama-3.1-8b-fast it is about 43 Neurons per call, so about 230 calls per day.
- **OpenRouter:** 50 calls per day, which is about 5 students. With the 10-credit purchase (about $10 once), 1,000 calls per day.
- **Gemini:** cannot be estimated without the developer's own AI Studio numbers. If the free tier is about 20 RPD per model (the Dec 2025 level), it is good only for testing. Tier 1 paid Flash-Lite is likely the realistic launch path.
- **Overall:** chaining Gemini → Groq (2 models) → Cloudflare → OpenRouter could plausibly serve about 30–60 light users per day for free.
- **Caching:** cache the generated plans in the database and regenerate them only on demand. This moves most daily load to cheap chat calls.

### Gaps
- Without the developer's actual Gemini AI Studio quota, primary-provider capacity is unknown. This is the biggest uncertainty in the recommendation.
- Paid Gemini Flash-Lite per-token prices were not captured, so the "cost to go paid" estimate is missing.
