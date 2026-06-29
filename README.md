# Verity — AI Recruiter App

## Project Overview

Verity is a modern, intelligent recruitment platform that uses AI to rank candidates against job descriptions based on **evidence and impact**, not keyword matching. It evaluates work history, project outcomes, transferable skills, and behavioral signals to produce calibrated rankings with explanations, strengths/gaps analysis, and trust scores.

## Live Demo

| Layer | URL |
|-------|-----|
| **Frontend** | [https://verity-pearl.vercel.app](https://verity-pearl.vercel.app) |
| **Backend API** | [https://verity-vmbg.onrender.com](https://verity-vmbg.onrender.com) |

> **Note:** The Render free tier spins down after inactivity. The first request may take 30–60 seconds while the server cold-starts.

## Tech Stack

Verified against `package.json` — these are the actual dependencies in use:

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, Radix UI (full component suite), Framer Motion, Recharts, React Router 6, React Query (TanStack) |
| **Backend** | Node.js, Express 5, TypeScript (via `tsx` runtime) |
| **Database** | PostgreSQL via Supabase (`@supabase/supabase-js`, `pg`) |
| **AI / LLM** | Groq SDK → `openai/gpt-oss-20b` model (for ranking, resume extraction, and copilot chat) |
| **Resume Parsing** | `pdf-parse` for PDF text extraction, `multer` for file uploads |
| **Other** | `dotenv`, `cors`, `concurrently`, `zod`, `jspdf`, `html2canvas`, `sonner` |

## Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

**Required variables** (must match `.env.example`):

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (used for future embedding support) |
| `GROQ_API_KEY` | Groq API key — powers all LLM calls (`openai/gpt-oss-20b`) |
| `DATABASE_URL` | PostgreSQL connection string (Supabase pooler format) |
| `SUPABASE_URL` | Supabase project URL (`https://xxxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role JWT (starts with `eyJ...`) |
| `PORT` | Backend server port (default: `5000`) |

> ⚠️ Never commit `.env` to version control. It is already in `.gitignore`.

## Local Setup

```bash
# 1. Clone
git clone https://github.com/Harshal2007vk/Verity.git
cd Verity

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your real keys

# 4. Run database migrations (first time only)
node migrate.cjs

# 5. Seed demo data (optional — populates 4 jobs + 10 candidates)
npx tsx direct_seed.ts
```

## Running Locally

```bash
# Start both frontend + backend together (recommended)
npm run start:local

# Or run them separately:
npm run server:dev   # Backend on http://localhost:5000
npm run dev          # Frontend on http://localhost:5173
```

- In **dev mode**, the frontend Vite proxy forwards `/api` requests to `localhost:5000`.
- In **production**, the frontend uses `VITE_API_BASE_URL` or falls back to the hardcoded Render URL.

## How the AI Ranking Pipeline Works

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Upload PDF │───▶│ pdf-parse    │───▶│ Groq LLM       │───▶│ Structured   │
│  Resume     │    │ extracts text│    │ extracts fields │    │ Candidate    │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                     │
┌─────────────┐    ┌──────────────┐    ┌────────────────┐            │
│  Ranked     │◀───│ Score        │◀───│ Groq LLM       │◀───────────┘
│  Results    │    │ Aggregation  │    │ evaluates fit   │
└─────────────┘    └──────────────┘    └────────────────┘
```

1. **Upload & Parse** — Recruiter uploads PDF resumes. `pdf-parse` extracts raw text, `multer` handles the file upload.
2. **AI Extraction** — The Groq LLM (`openai/gpt-oss-20b`) processes raw text and returns structured JSON: name, title, skills, work history, education.
3. **Ranking** — For each candidate × job pair, the LLM evaluates skill depth, experience quality, project impact, and behavioral signals. It returns sub-scores plus a written explanation.
4. **Trust Score** — A separate `trustService` calculates a trust score based on evidence links, work history consistency, and verifiable claims.
5. **Score Aggregation** — Final score = weighted combination:
   - 40% semantic fit
   - 20% skill depth
   - 15% experience quality
   - 15% project impact
   - 10% trust score
6. **Display** — Results are stored in the `ranking_results` table and displayed in the dashboard, sorted by overall score with full explanations.

## Known Issues & Recent Fixes

| Fix | Description |
|-----|-------------|
| **CORS allow-list** | Server now accepts requests from Vercel production URL, localhost:5173/5174/3000, and allows no-origin requests (curl, mobile). |
| **API_BASE env var** | Frontend `base44Client.js` uses Vite proxy (`/api`) in dev and `VITE_API_BASE_URL` or hardcoded Render URL in production. Fixed hardcoded `localhost` URLs in `CandidatePool.jsx` and `CandidateComparison.jsx`. |
| **Groq model migration** | Replaced deprecated `llama3-70b-8192` with `openai/gpt-oss-20b` across all services. Added `response_format: { type: 'json_object' }` for reliable JSON output. |
| **Demo dataset** | Expanded from 2 generic candidates to 10 diverse candidates across 4 job roles (ML, Backend, Design, Data), each with realistic work histories and evidence links. |
| **Render 502 fix** | Moved `tsx` from devDependencies to dependencies so Render can run `tsx server/server.ts` in production. Tuned start script to prevent OOM. |
| **TypeScript** | Fixed multer upload route type errors. Server compiles clean with `tsc -p tsconfig.server.json --noEmit`. |
| **API retries** | `InvokeLLM` in the frontend client now retries up to 3 times with exponential backoff on transient failures. |

## Project Structure

```
├── server/                  # Express backend (TypeScript)
│   ├── server.ts            # Entry point, middleware, routes
│   ├── database/
│   │   └── db.ts            # Supabase client init + connection validation
│   ├── routes/
│   │   ├── aiRoutes.ts      # /api/ai/* (LLM invoke, copilot chat)
│   │   ├── candidateRoutes.ts
│   │   ├── jobRoutes.ts
│   │   └── rankingRoutes.ts # /api/rankings/* (rank-candidates, fetch)
│   └── services/
│       ├── aiService.ts     # Groq LLM calls (resume extraction, chat)
│       ├── rankingService.ts # AI ranking + score aggregation
│       ├── embeddingService.ts # Cosine similarity (embeddings stubbed)
│       └── trustService.ts  # Evidence-based trust scoring
├── src/                     # React frontend
│   ├── api/base44Client.js  # API client (replaces Base44 SDK calls)
│   ├── components/          # Radix UI components
│   ├── pages/               # Route pages (Dashboard, CandidatePool, etc.)
│   └── lib/                 # Auth context, utilities
├── .env.example             # Template for required env vars
├── migrate.cjs              # DB migration script (ALTER TABLE)
├── direct_seed.ts           # Demo data seeder (4 jobs + 10 candidates)
├── qa_test.ps1              # Full QA test suite (PowerShell)
├── tsconfig.server.json     # TypeScript config for server
└── vite.config.js           # Vite + Base44 plugin config
```

## QA Testing

```powershell
# Start backend first
npm run server:dev

# In another terminal, run the full test suite
.\qa_test.ps1
```

The test suite covers: health check, CRUD operations, AI LLM invocation, end-to-end ranking (evidence-rich vs keyword-only candidates), stored rankings retrieval, error handling, security (no secret leaks), and TypeScript compilation.

## License

MIT
