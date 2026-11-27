# KnowledgeHub 2.0

A free, public knowledge-sharing platform where anyone can upload Google Drive PDF links with metadata, browse files shared by others, and read them online — no subscription, no paywalls.

---

## What It Does

| Action | Who can do it |
|---|---|
| Browse & search files | Anyone (no login) |
| Preview a file | Anyone |
| Upload a file | Logged-in users |
| View own uploads | Logged-in users |
| View profile & stats | Logged-in users |

---

## Architecture

```
Browser (React SPA)
        │
        │  /api/*  (same-origin)
        ▼
┌───────────────────────────────────┐
│  Dev:  Express  (server-simple.js)│  ← port 3000, proxied by Vite
│  Prod: Vercel Serverless (api/)   │  ← deployed automatically
└───────────────────────────────────┘
        │
        ├── Auth  → Google Apps Script (AUTH sheet)
        └── Files → Google Apps Script (FILES sheet)
                            │
                    Google Sheets (data store)
```

**Key principle:** The UI only renders — all API calls, data shaping, deduplication, and Apps Script formats are owned by the server.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix primitives) |
| Icons | lucide-react |
| Fonts | Science Gothic (WOFF2, self-hosted) |
| Animations | CSS keyframes + View Transitions API |

### Backend (Local Dev)
| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Entry point | `server/server-simple.js` |
| Auto-reload | `node --watch` |
| Auth source | Google Apps Script (upstream) |
| Files source | Google Apps Script (upstream) |

### Backend (Production — Vercel)
| File | Route | Purpose |
|---|---|---|
| `api/auth.js` | `POST /api/auth` | Login / Signup passthrough |
| `api/auth/login.js` | `POST /api/auth/login` | Login (explicit route) |
| `api/auth/signup.js` | `POST /api/auth/signup` | Signup (explicit route) |
| `api/files.js` | `GET /api/files` | List / browse files |
| `api/files/upload.js` | `POST /api/files/upload` | Upload file metadata |
| `api/home.js` | `GET /api/home` | Featured files + stats |
| `api/taxonomy.js` | `GET /api/taxonomy` | Topics per audience |

### Shared Libs (`lib/`)
| File | Purpose |
|---|---|
| `lib/authUpstream.js` | Builds `{script:"AUTH", action, ...fields}` and POSTs to Apps Script |
| `lib/filesUpstream.js` | Loads rows, deduplicates, paginates, builds taxonomy |
| `lib/http.js` | `setCors()` and `readBody()` helpers for Vercel functions |

### Data Store
- **Google Sheets** — two sheets, one for users (AUTH) and one for files (FILES)
- **Google Apps Script** — two deployed web apps (`/exec` URLs) that read/write the sheets
- No traditional database

---

## API Endpoints

### Auth
```
POST /api/auth
Body: { script:"AUTH", action:"login"|"signup", email, password, [username, confirmPassword, userType] }
→    { ok, username, email, userType, token }
```

### Files
```
GET  /api/files                    → { ok, rows[], total, hasMore }
GET  /api/files?email=x@y.com      → rows for one uploader only
GET  /api/files/search?q=keyword   → { ok, rows[], total }
POST /api/files/upload             → { ok, msg, duplicate }
GET  /api/home                     → { ok, featured[], stats:{files,titles,contributors} }
GET  /api/taxonomy                 → { ok, categories:{ student:[{name,count}], ... } }
```

---

## Pages & Routes

| Route | Page | Auth required |
|---|---|---|
| `/` | Landing page (home with guest banner) | No |
| `/home` | Home (stats, featured files) | Yes |
| `/files` | Browse all files | Yes |
| `/my-uploads` | Files uploaded by current user | Yes |
| `/upload` | Upload a new PDF | Yes |
| `/profile` | User profile & stats | Yes |
| `/login` | Login | No |
| `/signup` | Signup | No |

---

## Key Components

```
src/components/
├── cards/FileCard.jsx          PDF-style icon card (no iframe in grid)
├── preview/FilePreviewModal.jsx Drive iframe loads only on click
├── navbar/Navigation.jsx       Desktop sidebar + mobile bottom tab bar
├── upload/AudiencePicker.jsx   Student / Professional / Everyone radio cards
├── upload/TopicPicker.jsx      Filterable topic chips + free-text input
├── toast/ToastProvider.jsx     Stacked toasts, top-right, max 3
├── Button/Button.jsx           Primary / secondary / danger / ghost variants
├── Input/Input.jsx             Label + error + password toggle
└── theme/ThemeToggle.jsx       Light ↔ Dark
```

---

## Features

### For Everyone
- Browse all shared PDFs in a card grid
- Search by title, description, topic, or uploader name
- Filter by audience category (Student / Professional / Everyone)
- Preview any file in a modal (Google Drive viewer)
- Infinite scroll — loads 20 at a time
- Dark / Light theme toggle

### For Logged-in Users
- Upload a Google Drive PDF link in a 3-step form
  - Step 1: Paste link (auto-validates, detects duplicate)
  - Step 2: Title + description
  - Step 3: Audience + topic (chips from live taxonomy)
- Draft auto-saves to sessionStorage
- My Uploads — same browse/search layout, filtered to your files
- Profile page — stats, recent uploads, account info

### Duplicate Detection
- Client-side: file ID checked against all known IDs on page load
- Server-side: file ID and title checked before hitting Apps Script
- Returns `{duplicate:true, duplicateType:"file"|"title"}` with a human-readable message

---

## Folder Structure

```
KnowledgeBooster-2.0/
├── api/                    Vercel serverless functions
│   ├── auth.js
│   ├── auth/login.js
│   ├── auth/signup.js
│   ├── files.js
│   ├── files/upload.js
│   ├── home.js
│   └── taxonomy.js
├── lib/                    Shared server logic (used by api/ and server/)
│   ├── authUpstream.js
│   ├── filesUpstream.js
│   └── http.js
├── server/                 Local Express dev server
│   └── server-simple.js
├── src/                    React frontend
│   ├── components/
│   ├── config/
│   │   ├── ui.config.js    All UI strings (configurable)
│   │   └── Api.config.jsx  Base URL config
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   │   ├── apiClient.js    Single HTTP layer
│   │   ├── authService.js  login / signup
│   │   └── filesService.js fetchFiles / fetchHome / fetchTaxonomy / saveFileMetadata
│   ├── styles/
│   └── utils/
├── apps-script/
│   └── FilesScript.gs      Improved Apps Script (deploy to replace current)
├── vercel.json
├── vite.config.js
└── package.json
```

---

## Running Locally

```powershell
# First time
npm install
cd server && npm install && cd ..

# Every time
npm run dev          # starts both frontend (5173) and backend (3000)
```

## Deploy to Production

```powershell
npm install -g vercel
vercel --prod
```

---

## Apps Script — Pending Upgrade

`apps-script/FilesScript.gs` is an improved version of the current deployed script. It adds:
- Duplicate file ID detection (prevents re-uploads)
- Formula-injection protection
- Write lock (no race conditions)
- Writes by header name (safe to add columns)
- Returns `msg` alongside `error`

**To deploy:** Apps Script editor → Deploy → Manage deployments → Edit → New version → Deploy. The URL stays the same.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_API_URL` | Frontend `.env` | Override API base URL (default: `/api`) |
| `AUTH_URL` | Server / Vercel | Override Apps Script auth URL |
| `FILES_URL` | Server / Vercel | Override Apps Script files URL |
| `AUTH_SOURCE` | Server only | `upstream` (default) or `local` |
| `FILES_SOURCE` | Server only | `upstream` (default) or `local` |
| `PORT` | Server only | Express port (default: 3000) |
