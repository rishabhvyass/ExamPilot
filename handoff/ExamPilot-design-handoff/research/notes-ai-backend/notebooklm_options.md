# NotebookLM (now "Gemini Notebook") integration options and alternatives for ExamPilot (React exam-prep app), as of October 2026

Important context: On **16 July 2026** Google renamed NotebookLM to **Gemini Notebook**. Google says it is "the same standalone product". Notebooks can now also be opened and created inside the Gemini app, and Google says notebooks are coming to AI Mode in Search. The post did not announce an API or any developer access. — [Google blog, "NotebookLM is now Gemini Notebook"](https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/); also reported by [Neowin](https://www.neowin.net/news/googles-notebooklm-isnt-called-notebooklm-anymore/) and [NC State OIT](https://oit.ncsu.edu/2026/07/17/notebooklm-changes-name-to-gemini-notebook/). The Cloud docs now say "Gemini Notebook Enterprise" (formerly NotebookLM Enterprise). The rest of these notes use the two names interchangeably.

## 1. Does NotebookLM have a public API? What does the NotebookLM Enterprise API offer, and can a student developer use it?

### Takeaway
The consumer product has no public API. The only official API belongs to NotebookLM/Gemini Notebook Enterprise. It is a Google Cloud (Discovery Engine) **v1alpha Preview** API. It can create, list, share and delete notebooks, add and delete sources, and create audio overviews. It covers no chat/Q&A, flashcards or quizzes. It also needs an enterprise subscription: at least 15 licences, users signed in through Cloud Identity or an enterprise IdP, and notebooks shareable only inside the Cloud project. That makes it unsuitable for a consumer student app whose users are the public.

### Cited Findings
- Enterprise is managed from the Google Cloud console. Users sign in at a project- and region-specific URL (`https://notebook.cloud.google.com/REGION/?project=PROJECT_NUMBER`) and need the IAM role `roles/discoveryengine.notebookLmUser`. — [Google Cloud: What is NotebookLM Enterprise](https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs)
- Authentication goes through Cloud Identity or a third-party IdP (Entra ID, Okta, Ping, OIDC/SAML). Notebooks can be shared **only with users in the same Google Cloud project, never publicly**. Data stays in the customer's project in a US or EU multi-region. Limits are 500 notebooks per user, 300 sources per notebook and 500 queries per user per day. Extra source types: DOCX, PPTX, XLSX. Also offers VPC-SC and CMEK. — [Google Cloud: What is NotebookLM Enterprise](https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs)
- Notebooks API: base URL `https://{us|eu|global}-discoveryengine.googleapis.com/v1alpha/projects/{PROJECT_NUMBER}/locations/{LOCATION}/notebooks`. Methods are create, get, `listRecentlyViewed`, `batchDelete` and `:share` (roles OWNER/WRITER/READER). Examples authenticate with `gcloud auth print-access-token`. The API is marked **Preview** under the Pre-GA terms ("might have limited support"). There is **no chat/query method**. — [Google Cloud: Create and manage notebooks (API)](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks)
- Sources API: `notebooks.sources.batchCreate`, `uploadFile`, `get` and `batchDelete`. Supported sources are Google Docs/Slides from Drive, raw text, web URLs, YouTube URLs, and uploaded files (.pdf, .txt, .md, .docx, .pptx, .xlsx, audio, video, .png/.jpg). The API is v1alpha Preview, and the page states no file-size limits. — [Google Cloud: Add and manage sources (API)](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks-sources)
- The docs also list an "Create an audio overview" API page. I found it linked but did not fetch it. — [Google Cloud: What is NotebookLM Enterprise](https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs)
- The standalone **Podcast API** (`POST https://discoveryengine.googleapis.com/v1/projects/PROJECT_ID/locations/global/podcasts`) turns text, image, audio or video contexts (under 100k tokens) into an MP3, SHORT (about 4–5 min) or STANDARD (about 10 min), in any BCP-47 language. It needed no notebook or licence. It is now marked **deprecated**: "Google isn't allowlisting new customers." — [Google Cloud: Podcast API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/podcast-api)
- Licensing: a subscription has 15 to 5,000 licences. Each user needs a licence. A free trial gives 14 days and 5,000 licences. Plans are monthly or yearly, billed to the project's Cloud Billing account. Admins need the Cloud NotebookLM Admin and Gemini Enterprise Admin roles. The page lists no prices. — [Google Cloud: Set up licensing](https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs/set-up-licensing)
- A third-party blog quotes Enterprise at "about $9/licence/mo" with a 15-licence minimum. This is not verified against an official Google price page. — [Googally: NotebookLM Pricing 2026](https://www.googally.com/blog/notebooklm-pricing)
- Unofficial wrappers for the official Enterprise API exist, for example the Rust/Python `nblm` client. — [PyPI nblm](https://pypi.org/project/nblm/); [docs.rs nblm-cli](https://docs.rs/nblm-cli)

### Inferences
- A student developer *could* technically open a Google Cloud project and start the 14-day trial. But the 15-seat minimum, the enterprise IdP sign-in, and sharing locked to project users mean ExamPilot's end users (the public) cannot be given notebooks. The API is built for an organisation's own employees, not for a backend serving consumers.
- Without a chat/query endpoint, the API cannot provide in-app Q&A in any case. ExamPilot would still have to send users out to the NotebookLM Enterprise UI.
- Being v1alpha Preview with the Podcast API deprecated, the product is unstable ground for building on.

### Gaps
- Official per-licence pricing for NotebookLM / Gemini Notebook Enterprise (the docs say to contact sales or check the console). I did not find it on a Google page.
- Exact request and response details of the audio-overview API (page not fetched). I found no evidence of API methods for video overviews, flashcards, quizzes or mind maps.
- Whether the July 2026 rename changed API names or endpoints. The docs still show `google.cloud.notebooklm.v1alpha`.

## 2. Consumer NotebookLM: deep links, sharing, embedding, unofficial libraries

### Takeaway
There is no official deep-link, embed, or "open NotebookLM with these sources" mechanism. The only official option is the notebook **share link**: "Anyone with a link", or a "chat view" link. Viewers need a Google account and can chat with the notebook and see artifacts the owner generated. Unofficial libraries such as `notebooklm-py` drive NotebookLM's undocumented internal endpoints with browser cookies. They are fragile and carry ToS/account risk, so they are not acceptable in a production app.

### Cited Findings
- Owners and editors can set notebook access to "Anyone with a link". There is also a "Copy link to chat view" option. Viewers need a Google account. Opening the link adds the notebook to their homepage, and they can ask questions and view owner-generated content (audio overviews, FAQs, briefing docs). Chat view hides sources and artifacts, but "doesn't fully block access". Owners' later edits show up through the same link. Paid owners get usage analytics. The page does not mention embedding or URL parameters. — [NotebookLM Help: public and featured notebooks](https://support.google.com/notebooklm/answer/16322204?hl=en)
- Public link sharing launched in June 2025. — [9to5Google](https://9to5google.com/2025/06/03/notebooklm-public-links/); [Google blog: NotebookLM public notebooks](https://blog.google/technology/google-labs/notebooklm-public-notebooks/)
- Since September 2025, flashcard sets and quizzes can be shared with anyone via a link (Workspace announcement). — [Workspace Updates, 11 Sep 2025](https://workspaceupdates.googleblog.com/2025/09/flashcards-quizzes-reports-notebook-lm-google-education.html)
- On the free tier, "Advanced sharing is limited to paid users". — [NotebookLM Help: Upgrade NotebookLM](https://support.google.com/notebooklm/answer/16213268?hl=en)
- `notebooklm-py` (teng-lin, MIT) calls "undocumented Google APIs" that "can change without notice". It authenticates with browser cookies (a Playwright login, imported cookies, or a "master token"). It is unofficial and not affiliated with Google. It may break or be rate-limited, and the README recommends it for prototypes and personal projects. It supports audio overviews (MP3), video overviews (MP4), quizzes and flashcards (JSON export) and mind maps. — [notebooklm-py README](https://raw.githubusercontent.com/teng-lin/notebooklm-py/main/README.md)
- Hosted MCP/connector toolkits for NotebookLM exist from Composio and Gumloop. I did not check whether they call the Enterprise API or unofficial endpoints. — [Composio NotebookLM toolkit](https://composio.dev/toolkits/notebook_lm); [Gumloop NotebookLM node](https://docs.gumloop.com/nodes/mcp/google_notebooklm)
- A Google AI developer forum thread asks where the NotebookLM API is, showing the long-standing lack of a consumer API. — [Google AI Developers Forum](https://discuss.ai.google.dev/t/how-to-access-notebooklm-via-api/5084/6)

### Inferences
- Two link-out patterns are realistic for ExamPilot. (a) Teachers or the ExamPilot team build curated public notebooks (for example, per syllabus) and link to them. (b) A "Study this in NotebookLM" button that opens notebooklm.google, where the student uploads their PDF by hand. Neither can push the student's PDF in automatically.
- Using cookie-based unofficial libraries with *users'* Google accounts would mean collecting Google session credentials. That is a serious security and ToS problem, and could also breach app-store and Google OAuth policies. Do not use them.

### Gaps
- I did not read Google's consumer ToS clause on automated access to NotebookLM, so the ToS risk is inferred, not quoted.
- No documented URL scheme for prefilling sources was found. Absence is noted, not proven.

## 3. NotebookLM features relevant to students (2025–2026) and free-plan limits

### Takeaway
Free NotebookLM (now Gemini Notebook) already covers source-grounded chat with citations, Audio Overviews, Video Overviews, mind maps, study guides/reports, flashcards, quizzes, a Learning Guide tutor mode, and Deep Research. Free users get 100 notebooks and 50 sources per notebook. Third parties report about 50 chats and 3 Audio Overviews per day. In India the paid tiers' generated outputs carry a forced watermark.

### Cited Findings
- Official tiers: Standard (free) gets 100 notebooks and 50 sources per notebook. Plus gets 200 and 100. Pro gets 500 and 300. Ultra 20TB gets 500 and 500, and Ultra 30TB gets 500 and 600. Daily quotas reset after 24 hours. The official page gives no per-feature daily numbers. Watermark removal is Pro/Ultra only, **except that a visible watermark is always applied in India, South Korea and Vietnam**. Free access needs only a Gmail account, and paid tiers also come through Workspace / Workspace for Education. Enterprise access offers "5X or more" artifacts. — [NotebookLM Help: Upgrade NotebookLM](https://support.google.com/notebooklm/answer/16213268?hl=en)
- Third-party figures: the free plan has 50 chats per day and 3 Audio Overviews per day. Plus costs $7.99/mo (Google AI Plus), Pro $19.99/mo (Google AI Pro), and Ultra $99.99 or $200/mo (split into two SKUs at I/O, May 2026). US students aged 18+ with .edu emails get Google AI Pro for $9.99/mo for 12 months. The free tier is said to include Audio/Video Overviews, mind maps, flashcards, quizzes and Deep Research. These are **not verified on an official page**. — [Googally: NotebookLM Pricing 2026](https://www.googally.com/blog/notebooklm-pricing); see also [Elephas: daily limits 2026](https://elephas.app/blog/notebooklm-daily-limit)
- Flashcards, quizzes with custom topic and difficulty, and reports in 130+ languages were announced 11 Sep 2025, rolling out from 2 Sep 2025. — [Workspace Updates](https://workspaceupdates.googleblog.com/2025/09/flashcards-quizzes-reports-notebook-lm-google-education.html); consumer coverage at [Android Authority](https://www.androidauthority.com/notebooklm-update-flashcards-quizzes-personal-tutor-3596019) and [AlternativeTo](https://alternativeto.net/news/2025/9/google-notebooklm-adds-flashcards-quizzes-and-new-formats-for-audio-overviews)
- Students can create personal class notebooks with NotebookLM in Google Classroom (27 Apr 2026). — [Workspace Updates, Apr 2026](https://workspaceupdates.googleblog.com/2026/04/students-can-now-create-personal-class-notebooks-with-NotebookLM-in-Google-Classroom.html)
- Video Overviews are available to students of all ages. — [Chrome Unboxed](https://chromeunboxed.com/notebooklms-fantastic-video-overviews-are-now-available-for-students-of-all-ages/)
- A secondary source lists further 2026 features without exact dates: Learning Guide (an AI tutor that asks questions), Lecture Mode (single-host audio up to 30 min), Video Overviews in 80 languages, a Gemini 3 Flash backbone, and chat history saved across sessions. — [Timewell column](https://timewell.jp/en/columns/notebooklm-update) (secondary; treat as indicative)
- Audio Overview formats (deep-dive, brief, critique, debate), three lengths, and 50+ languages are visible through the unofficial `notebooklm-py` feature list. — [notebooklm-py README](https://raw.githubusercontent.com/teng-lin/notebooklm-py/main/README.md)
- In July 2026 each notebook gained a "secure cloud computer" for code-based data analysis (Ultra first, Pro "over the coming weeks"). This is not very relevant to exam prep. — [Google blog](https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/)

### Inferences
- For students, free NotebookLM is a very strong product that ExamPilot cannot easily beat on features. ExamPilot should differentiate on exam structure: syllabus, past papers, spaced repetition, progress tracking. Linking out for "deep study" sessions does not compete with that.

### Gaps
- Official per-day quotas for free-tier Video Overviews, flashcards, quizzes, reports and Deep Research. Google's help page omits them.
- Whether the US student AI Pro offer extends to India (relevant to the user). Not found.

## 4. Open-source NotebookLM alternatives (self-host or embed)

### Takeaway
**Open Notebook** (MIT) is the closest NotebookLM clone, with multi-speaker podcasts and a REST API, but it needs Docker plus SurrealDB. **SurfSense** (Apache-2.0), **kotaemon** (Apache-2.0, best PDF citations UI, Gradio) and **AnythingLLM** (MIT, embeddable chat widget plus developer API) are permissive alternatives. **Khoj** is AGPL-3.0, risky for a hosted commercial app. All of them are self-hosted web servers built as single-tenant or team tools. None is a drop-in multi-tenant backend for a consumer mobile/web app. They are better as reference designs or for a REST backend.

### Cited Findings
- **Open Notebook** (lfnovo/open-notebook): MIT, about 38k stars. Stack: Python/FastAPI + Next.js/React + SurrealDB + LangChain, deployed with Docker Compose. Features: 18+ LLM providers via Esperanto (OpenAI, Anthropic, Ollama, LM Studio and more), multi-speaker podcasts (1–4 speakers, episode profiles), chat with citations (the README calls them "basic references (will improve)"), transformations, a REST API (docs at :5055/docs), and MCP. Flashcards are not mentioned. — [GitHub lfnovo/open-notebook](https://github.com/lfnovo/open-notebook)
- Open Notebook runs its UI on :8502 and API on :5055. Change the default encryption key before exposing it. SurrealDB is an unfamiliar operational dependency for many teams. The MIT licence suits commercial products. — [Rohit Raj comparison, 7 Jun 2026](https://rohitraj.tech/en/notes/open-notebook-vs-khoj-vs-surfsense-notebooklm-2026)
- **Khoj**: AGPL-3.0, so offering a modified hosted version may require releasing your source. Python/Postgres on Docker Compose. Latest tag 2.0.0-beta.28 (26 Mar 2026). It indexes PDFs, Markdown, GitHub, web and YouTube, and offers agents, automations and deep research. The comparison advises against it for commercial SaaS without legal sign-off. — [Rohit Raj comparison](https://rohitraj.tech/en/notes/open-notebook-vs-khoj-vs-surfsense-notebooklm-2026)
- **SurfSense**: Apache-2.0 (with a patent grant), Python + Postgres/pgvector on Docker Compose. Latest release v0.0.26 (1 Jun 2026). It has many SaaS connectors (Slack, Notion, Gmail, etc.), hybrid search plus rerankers, and claims 100+ LLMs. It is aimed at team knowledge, not students. — [Rohit Raj comparison](https://rohitraj.tech/en/notes/open-notebook-vs-khoj-vs-surfsense-notebooklm-2026)
- **kotaemon** (Cinnamon): Apache-2.0, Gradio UI, Python 3.10+, Docker images (lite/full) on GHCR, demo on Hugging Face Spaces. Citations come with relevance scores and **highlights in an in-browser PDF viewer**, and it has GraphRAG options (MS GraphRAG, NanoGraphRAG, LightRAG). About 25.7k stars and 214 open issues. — [GitHub Cinnamon/kotaemon](https://github.com/Cinnamon/kotaemon)
- **AnythingLLM** (Mintplex Labs): MIT. Features: workspaces, chat with docs plus citations, agents and MCP, an **embeddable website chat widget** (Docker only), a developer API, multi-user support (Docker only), and many vector DBs (LanceDB by default, PGVector, Pinecone, Chroma, Qdrant and more). Runs as a desktop app (Mac/Win/Linux) or on Docker, and there is an open-source Android mobile app. — [GitHub Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm)
- Comparison and alternatives listings: [openalternative: AnythingLLM vs SurfSense](https://openalternative.co/compare/anythingllm/vs/surfsense); [AlternativeTo: SurfSense alternatives](https://alternativeto.net/software/surfsense)

### Inferences
- For a React app, the most practical OSS route is AnythingLLM's developer API, or Open Notebook's REST API as a backend behind ExamPilot's own UI. Both still need a always-on server (VPS or container host) plus LLM API keys, and per-user isolation would have to be designed (workspaces or notebooks per user).
- kotaemon's page-highlighted citations are the best UX reference for "cite page N of your PDF", but Gradio cannot be embedded in a polished React/React Native app.
- For a solo student developer, running Docker and SurrealDB/Postgres plus a podcast TTS pipeline is probably more operational work than building a slim RAG feature on Supabase plus Gemini (section 5).

### Gaps
- Exact current versions and release dates for Open Notebook, kotaemon and AnythingLLM (not shown in the fetched pages).
- Whether any of these supports flashcard or quiz generation out of the box. Not confirmed for any except via custom prompts or transformations.
- Resource requirements (RAM/CPU) for the self-hosted stacks. Not documented in the fetched pages.

## 5. Replicating the core NotebookLM experience with an LLM API: RAG vs long-context

### Takeaway
For typical student PDFs (lecture notes, textbook chapters, past papers under 1,000 pages and 50 MB), sending the whole PDF to Gemini is the simplest way to get a working "chat with my notes" feature. Gemini reads pages visually, including diagrams, at 258 tokens per page. Classic RAG (pdf.js text extraction, chunks with page numbers, embeddings in Supabase pgvector) costs less per query, scales to large libraries, and gives exact page citations. A good plan: start with long-context and add RAG when libraries grow.

### Cited Findings
- Gemini API PDF limits: up to **50 MB or 1,000 pages** per PDF, inline or via the Files API. Files API uploads are stored for **48 hours**. Each page costs **258 tokens**. Pages are processed visually and rescaled to 768–3072 px. On Gemini 3, native embedded PDF text is extracted and **not billed**, with page-image tokens reported as the IMAGE modality. Non-PDF text formats lose charts and formatting. Examples use `gemini-3.8-flash`. — [Gemini API: Document processing](https://ai.google.dev/gemini-api/docs/document-processing)
- By that per-page figure, a 300-page textbook is about 77k tokens, well inside a long-context model's window (derived from the 258 tokens/page figure above).
- AnythingLLM ships PGVector as a supported vector store, showing that Postgres/pgvector is a standard choice for document chat. — [GitHub AnythingLLM](https://github.com/Mintplex-Labs/anything-llm)
- SurfSense uses Postgres with pgvector plus hybrid search and rerankers for higher-accuracy answers. — [Rohit Raj comparison](https://rohitraj.tech/en/notes/open-notebook-vs-khoj-vs-surfsense-notebooklm-2026)
- The deprecated Podcast API capped input at 100k tokens and produced 4–10 minute MP3s. This is a useful benchmark for scoping an in-house "audio overview": LLM-written two-host script plus TTS. — [Google Cloud: Podcast API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/podcast-api)

### Inferences
- **Long-context approach (MVP):** upload the PDF to the Gemini Files API, or cache its context. Prompt the model to answer only from the document and to cite `[p. N]`. Gemini sees page images, so asking for page numbers is feasible, but each citation should be checked against the real page text, because the model can mis-number pages. Watch for: the 48-hour file expiry (re-upload or keep your own copy in Supabase Storage), and the cost of re-sending the full document on every question. Context caching should help with that, but it is unverified here.
- **RAG approach:** extract text per page in the browser with pdf.js (`getTextContent()` per page, so page numbers are exact). Chunk to roughly 500–1,000 tokens with `{doc_id, page}` metadata. Embed with an embeddings API, store in Supabase `pgvector` with row-level security per user, then retrieve top-k and generate an answer with `[doc, page]` citations. This gives exact, clickable page citations that can open the PDF at that page in pdf.js. Scanned PDFs have no text layer, so they need OCR or fall back to sending pages to Gemini.
- Flashcards, quizzes and mind maps are all simple structured-output generations (JSON schema) over either the whole document or retrieved chunks. Mind maps can be rendered client-side (for example with a tree or graph library). An audio overview can be built as an LLM script plus a TTS API, with the audio cached in storage.
- Hybrid recommendation: start with long-context (fastest to ship). Switch to RAG when a user's library exceeds a few hundred pages, or when per-query cost or latency matters.

### Gaps
- Current Gemini API prices per token and for context caching, and embedding model names and prices. Not fetched in this session, so check ai.google.dev/pricing.
- No benchmark found comparing long-context vs RAG citation accuracy for page numbers.
- Supabase pgvector specifics (index types, free-tier limits) were not fetched in this session.

## 6. Recommendation: link out to NotebookLM vs build a NotebookLM-like assistant in-app

### Takeaway
ExamPilot cannot embed or programmatically drive consumer NotebookLM. The Enterprise API is enterprise-only, Preview, has no chat endpoint, and does not suit public users. Recommended approach: **build a slim "NotebookLM-like" assistant in-app** on Gemini (or another LLM) plus Supabase. Optionally add a **"Open in NotebookLM" link-out** (a plain link to notebooklm.google, or curated public notebooks) as a free power-user extra, not a core dependency.

### Cited Findings
- The official API is v1alpha Preview, enterprise-licensed (minimum 15 seats), restricted to project users with no public sharing, and has no chat method. — [Cloud docs: notebooks API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks); [licensing](https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs/set-up-licensing); [overview](https://docs.cloud.google.com/agentspace/notebooklm-enterprise/docs)
- Consumer sharing works only through "Anyone with a link" notebooks that require a Google account, with no documented embedding. — [NotebookLM Help](https://support.google.com/notebooklm/answer/16322204?hl=en)
- The Podcast API is closed to new customers, so Google's audio-overview tech is not available to new developers. — [Podcast API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/podcast-api)
- Unofficial clients depend on undocumented endpoints and cookies, and are "for prototypes/personal projects". — [notebooklm-py](https://raw.githubusercontent.com/teng-lin/notebooklm-py/main/README.md)
- The Gemini API natively accepts PDFs up to 1,000 pages / 50 MB. — [Gemini API docs](https://ai.google.dev/gemini-api/docs/document-processing)

### Inferences
- Suggested phased plan:
  1. **MVP:** upload a PDF to Supabase Storage and send it to the Gemini API (long-context). Build grounded chat with `[p. N]` citations, plus a flashcard and quiz generator using JSON output, which ties into ExamPilot's own spaced-repetition and score tracking.
  2. **v2:** pdf.js per-page extraction, then embeddings, then Supabase pgvector for multi-document libraries and exact clickable page citations. Add mind maps as structured JSON rendered client-side.
  3. **v3 (optional):** an "audio revision" overview made with an LLM script plus TTS, cached per document.
  4. **Extra:** an "Open in NotebookLM" button and/or curated public NotebookLM notebooks per exam/syllabus, as a link-out only.
- Self-hosting Open Notebook or AnythingLLM as the backend is viable only if a server can run full-time. For a solo developer, a serverless Supabase plus Gemini pipeline is likely simpler and cheaper.
- For Indian users specifically, the forced watermark on NotebookLM outputs in India and the possible lack of India student offers make an in-app feature relatively more valuable.

### Gaps
- Cost modelling per active student. LLM and embedding prices were not fetched.
- Whether Google plans a consumer NotebookLM / Gemini Notebook developer API. No announcement found as of October 2026.
