# KnowledgeHub Architecture

Complete system architecture and data flow diagram.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          React.js Frontend (Vite)                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │  │
│  │  │ Pages    │  │Components│  │   Styles         │    │  │
│  │  ├──────────┤  ├──────────┤  ├──────────────────┤    │  │
│  │  │ Home     │  │ FileCard │  │ variables.css    │    │  │
│  │  │ Upload   │  │ Modal    │  │ responsive.css   │    │  │
│  │  │ Files    │  │ Navbar   │  │ global.css       │    │  │
│  │  │ Auth     │  │ Toast    │  │ animations       │    │  │
│  │  │ Profile  │  │ Skeleton │  │                  │    │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │  │
│  │                                                        │  │
│  │  Services Layer                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ authService  │  │ filesService │                 │  │
│  │  │ - login      │  │ - fetchFiles │                 │  │
│  │  │ - signup     │  │ - uploadFile │                 │  │
│  │  │ - verify     │  │ - searchFile │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  │                                                        │  │
│  │  Config Layer                                         │  │
│  │  ┌────────────────────────────────────────────┐     │  │
│  │  │ Api.config.jsx                             │     │  │
│  │  │ - API base URL: http://localhost:3000/api  │     │  │
│  │  │ - Auth headers & JWT token management      │     │  │
│  │  └────────────────────────────────────────────┘     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Responsive Breakpoints:                                      │
│  - Mobile: 320px - 767px     (1 column, full-width)          │
│  - Tablet: 768px - 1023px    (2 columns, side menus)         │
│  - Desktop: 1024px+          (3-4 columns, sidebars)         │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ HTTP/REST API
               │ (JSON over HTTPS/HTTP)
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Server)                    │
│              Node.js Express REST API Server                    │
│                   (http://localhost:3000)                       │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Middleware Pipeline                                   │  │
│  │  ┌──────────────┬──────────────┬─────────────────┐    │  │
│  │  │ CORS/Headers │ Rate Limiter │ Request Logger  │    │  │
│  │  │ Helmet.js    │ 100 req/15m  │ Error Handler   │    │  │
│  │  └──────────────┴──────────────┴─────────────────┘    │  │
│  │                      ↓                                  │  │
│  │  ┌────────────────────────────────────────────────┐   │  │
│  │  │ Routes                                         │   │  │
│  │  │ ┌────────────┬────────────┬──────────────┐    │   │  │
│  │  │ │ /auth      │ /files     │ /health      │    │   │  │
│  │  │ │ POST /login│ POST upload│ GET status   │    │   │  │
│  │  │ │ POST signup│ GET list   │ GET detailed │    │   │  │
│  │  │ │ POST verify│ PUT update │              │    │   │  │
│  │  │ │ GET me     │ DELETE     │              │    │   │  │
│  │  │ │ POST logout│ GET search │              │    │   │  │
│  │  │ └────────────┴────────────┴──────────────┘    │   │  │
│  │  │                 ↓                             │   │  │
│  │  │  ┌──────────────────────────────────────┐    │   │  │
│  │  │  │ Controllers (Business Logic)         │    │   │  │
│  │  │  │ ┌────────────┐  ┌────────────────┐  │    │   │  │
│  │  │  │ │authControl │  │filesController │  │    │   │  │
│  │  │  │ │- signup()  │  │- getFiles()    │  │    │   │  │
│  │  │  │ │- login()   │  │- uploadFile()  │  │    │   │  │
│  │  │  │ │- verify()  │  │- searchFiles() │  │    │   │  │
│  │  │  │ │- logout()  │  │- deleteFile()  │  │    │   │  │
│  │  │  │ └────────────┘  └────────────────┘  │    │   │  │
│  │  │  │          ↓                           │    │   │  │
│  │  │  │  Services Layer                      │    │   │  │
│  │  │  │  ┌────────────┐  ┌────────────────┐ │    │   │  │
│  │  │  │  │validators  │  │cache.service   │ │    │   │  │
│  │  │  │  │- email     │  │- TTL: 1 hour   │ │    │   │  │
│  │  │  │  │- password  │  │- Node-Cache    │ │    │   │  │
│  │  │  │  │- drive URL │  │                │ │    │   │  │
│  │  │  │  └────────────┘  └────────────────┘ │    │   │  │
│  │  │  └──────────────────────────────────────┘    │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │  Middleware Authentication                           │  │
│  │  ┌──────────────────────────────────────────┐        │  │
│  │  │ JWT Verification (verifyAuth)             │        │  │
│  │  │ - Extract token from Authorization header │        │  │
│  │  │ - Verify signature with JWT_SECRET       │        │  │
│  │  │ - Attach user info to request            │        │  │
│  │  │ - Return 401 if invalid                  │        │  │
│  │  └──────────────────────────────────────────┘        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Security Features:                                            │
│  ✅ CORS: origin controlled                                   │
│  ✅ Rate Limiting: 100 req/15min (auth: 5)                   │
│  ✅ Helmet: Security headers included                        │
│  ✅ HTTPS Ready: Can use reverse proxy                       │
│  ✅ JWT: Token-based stateless auth                         │
│  ✅ bcryptjs: Password hashing                              │
└──────────────┬──────────────────────────────────────────────────┘
               │
        ┌──────┴──────────────┬────────────────┐
        │                     │                │
        │                     │                │
        v                     v                v
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  GOOGLE SHEETS   │  │ GOOGLE DRIVE     │  │  JWT SESSION     │
│                  │  │                  │  │  TOKENS          │
│ File Metadata:   │  │ File Storage:    │  │                  │
│ - username       │  │ - Direct links   │  │ Issued: login    │
│ - email          │  │ - Thumbnails     │  │ Verified: on req │
│ - title          │  │ - Previews       │  │ Expires: 7 days  │
│ - category       │  │ - Permissions    │  │ Secret: JWT_SEC  │
│ - driveUrl       │  │                  │  │                  │
│ - fileid         │  │ Format:          │  │ Format:          │
│ - timestamp      │  │ https://drive... │  │ Bearer <token>   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 📡 Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       │ 1. POST /auth/signup
       │    {username, email, password}
       ↓
┌──────────────────┐
│  Auth Routes     │
└──────┬───────────┘
       │
       │ 2. Validate input
       ↓
┌──────────────────┐
│  Validators      │
│  - email format  │
│  - password > 6  │
└──────┬───────────┘
       │
       │ 3. Hash password
       ↓
┌──────────────────┐
│   bcryptjs       │
│   10 rounds      │
└──────┬───────────┘
       │
       │ 4. Store user
       ↓
┌──────────────────┐
│   Auth Storage   │
│   (In-memory)    │
└──────┬───────────┘
       │
       │ 5. Generate JWT
       ↓
┌──────────────────┐
│  JWT Generation  │
│  Expires: 7d     │
└──────┬───────────┘
       │
       │ 6. Response
       ↓
┌─────────────┐
│   Frontend  │
│ Receives    │
│ - token     │
│ - user info │
└─────────────┘
```

### 2. File Upload Flow

```
┌─────────────┐
│   Frontend  │
│ User uploads│
│  file link  │
└──────┬──────┘
       │
       │ 1. POST /files/upload
       │    Auth: Bearer <token>
       ↓
┌──────────────────┐
│  Auth Middleware │
│  Verify token    │
└──────┬───────────┘
       │
       │ 2. Extract user
       ↓
┌──────────────────┐
│ File Controller  │
└──────┬───────────┘
       │
       │ 3. Validate
       ├─ Title present
       ├─ Drive URL valid
       └─ File ID extractable
       ↓
┌──────────────────┐
│   Validators     │
│ extractDriveFileId
└──────┬───────────┘
       │
       │ 4. Create entry
       ↓
┌──────────────────┐
│  File Storage    │
│  (In-memory)     │
│  ID: auto-inc    │
└──────┬───────────┘
       │
       │ 5. Clear cache
       ↓
┌──────────────────┐
│   Cache Service  │
│   Node-Cache     │
│   TTL: 1 hour    │
└──────┬───────────┘
       │
       │ 6. Response
       ↓
┌─────────────┐
│   Frontend  │
│  Redirect to│
│    /files   │
└─────────────┘
```

### 3. File Search/Browse Flow

```
┌─────────────┐
│   Frontend  │
│   Search or │
│    Browse   │
└──────┬──────┘
       │
       │ 1. GET /files/search?q=react
       │    or GET /files?offset=0&limit=20
       ↓
┌──────────────────┐
│  Rate Limiter    │
│  100 req/15m     │
└──────┬───────────┘
       │
       │ 2. Check cache
       ↓
┌──────────────────┐
│   Cache Service  │
│   (1 hour TTL)   │
└──────┬───────────┘
       │
       │ 3a. If CACHE HIT
       ├──→ Return cached data
       │
       │ 3b. If CACHE MISS
       ↓
┌──────────────────┐
│  File Controller │
│  - Filter data   │
│  - Paginate      │
│  - Sort results  │
└──────┬───────────┘
       │
       │ 4. Store in cache
       ↓
┌──────────────────┐
│   Cache Service  │
└──────┬───────────┘
       │
       │ 5. Response
       ↓
┌─────────────┐
│   Frontend  │
│  Display    │
│  files in   │
│   grid      │
└─────────────┘
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Transport Security (HTTPS/TLS)              │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - SSL/TLS encryption for all requests           │  │
│  │ - Secure token transmission                     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 2: Input Validation                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - Email format validation                       │  │
│  │ - Password strength requirements                │  │
│  │ - Google Drive URL extraction & validation      │  │
│  │ - Text sanitization                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 3: Authentication                              │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - JWT tokens with signature verification        │  │
│  │ - Token expiration (7 days)                     │  │
│  │ - Bearer token in Authorization header          │  │
│  │ - Stateless authentication                      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 4: Password Security                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - bcryptjs hashing (10 rounds)                  │  │
│  │ - Salted hashes (never plain text)              │  │
│  │ - Constant-time comparison                      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 5: Authorization                               │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - Owner-only file operations (delete/update)    │  │
│  │ - User email verification in requests           │  │
│  │ - Protected routes require JWT                  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 6: Rate Limiting                               │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - General: 100 requests per 15 minutes          │  │
│  │ - Auth: 5 attempts per 15 minutes (brute force) │  │
│  │ - Search: 300 requests per 15 minutes           │  │
│  │ - IP-based tracking                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 7: Response Headers                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - X-Content-Type-Options: nosniff               │  │
│  │ - X-XSS-Protection: 1; mode=block               │  │
│  │ - X-Frame-Options: DENY (clickjacking)          │  │
│  │ - Content-Security-Policy configured            │  │
│  │ - Referrer-Policy: strict-origin-when-cross...  │  │
│  │ - CORS: origin validation                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Layer 8: Error Handling                              │
│  ┌─────────────────────────────────────────────────┐  │
│  │ - No sensitive info in error messages           │  │
│  │ - Generic 500 errors in production              │  │
│  │ - Detailed logs (server-side only)              │  │
│  │ - Request ID tracking for debugging             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema (Future)

When integrating with Firebase/MongoDB:

```
USERS Collection
├── _id (UUID)
├── email (unique)
├── username
├── passwordHash (bcryptjs)
├── createdAt
├── updatedAt
└── metadata

FILES Collection
├── _id (UUID)
├── userId (FK → Users)
├── title
├── description
├── category (student|professional|others)
├── subcategory
├── googleDriveUrl
├── googleDriveFileId
├── thumbnailUrl
├── fileSize
├── mimeType
├── isPublic
├── views (count)
├── createdAt
├── updatedAt
└── metadata

SHARES Collection
├── _id (UUID)
├── fileId (FK → Files)
├── sharedWith (email)
├── permission (view|edit|admin)
├── createdAt
└── expiresAt
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   DEPLOYMENT OPTIONS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Option 1: Heroku (Recommended for Beginners)          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Frontend (Vercel)         Backend (Heroku)     │  │
│  │  ├─ Next.js/Vite           ├─ Node.js         │  │
│  │  ├─ Auto-deploy on push    ├─ PostgreSQL      │  │
│  │  ├─ CDN worldwide          ├─ Redis cache     │  │
│  │  └─ $0-20/month            └─ $7-50/month     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Option 2: Railway (Modern Alternative)                │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Frontend (Railway)        Backend (Railway)    │  │
│  │  ├─ Docker-based           ├─ Docker          │  │
│  │  ├─ Pay-per-use            ├─ Pay-per-use     │  │
│  │  ├─ Fast deployments        ├─ Database incl. │  │
│  │  └─ $5+/month               └─ $5+/month      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Option 3: AWS (Enterprise)                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Frontend (S3+CloudFront)  Backend (EC2/Lambda)│  │
│  │  ├─ Highly scalable        ├─ Auto-scaling    │  │
│  │  ├─ Global distribution    ├─ Load balancer   │  │
│  │  ├─ CDN 199 locations      └─ RDS Database    │  │
│  │  └─ Pay-per-use            └─ $20+/month     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline

```
┌──────────────────────────────────────────────────────┐
│          GITHUB → CI/CD → DEPLOYMENT                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. Developer pushes code                           │
│     └─→ main or develop branch                      │
│                                                      │
│  2. GitHub Actions triggered                        │
│     ├─ Code checkout                                │
│     ├─ Lint & format check                          │
│     ├─ Unit tests run                               │
│     ├─ Build verification                           │
│     └─ Security scan (optional)                     │
│                                                      │
│  3. Tests pass ✓                                    │
│     ├─ Docker image built                           │
│     ├─ Tagged with git SHA                          │
│     └─ Pushed to registry                           │
│                                                      │
│  4. Deployment to Staging                           │
│     ├─ Pull latest image                            │
│     ├─ Run migration scripts                        │
│     ├─ Smoke tests                                  │
│     └─ Notify team                                  │
│                                                      │
│  5. Production Deploy (Manual Approval)             │
│     ├─ Blue-green deployment                        │
│     ├─ Health check endpoints                       │
│     ├─ Rollback capability                          │
│     └─ Monitoring alert setup                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📈 Performance Architecture

```
┌───────────────────────────────────────────────────────┐
│          PERFORMANCE OPTIMIZATION LAYERS              │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Client-Side:                                         │
│  ├─ Code splitting (lazy load routes)                │
│  ├─ Image optimization (webp, responsive)            │
│  ├─ Minification & tree-shaking                       │
│  ├─ Service Worker (PWA support)                      │
│  └─ Local caching (IndexedDB)                         │
│                                                       │
│  Network:                                             │
│  ├─ CDN for static assets                             │
│  ├─ Compression (gzip/brotli)                         │
│  ├─ HTTP/2 push                                       │
│  └─ Domain sharding                                   │
│                                                       │
│  Server-Side:                                         │
│  ├─ Database query optimization                       │
│  ├─ Connection pooling                                │
│  ├─ Index optimization                                │
│  └─ Query caching                                     │
│                                                       │
│  Caching:                                             │
│  ├─ Browser cache (304 Not Modified)                  │
│  ├─ Server cache (Node-Cache/Redis) - 1 hour TTL    │
│  ├─ CDN cache                                         │
│  └─ Database query cache                              │
│                                                       │
│  Monitoring:                                          │
│  ├─ Performance metrics                               │
│  ├─ Error tracking (Sentry)                           │
│  ├─ APM (Application Performance Monitoring)          │
│  └─ User experience metrics (Core Web Vitals)         │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Page Load Time | < 2s | Planning |
| API Response Time | < 500ms | Planning |
| Search Response | < 200ms | Planning |
| Cache Hit Rate | > 60% | Planning |
| Uptime | 99.9% | Planning |
| Mobile Score | > 90 | Planning |
| Lighthouse Performance | > 85 | Planning |
| Database Query Time | < 100ms | Planning |

---

## 🔗 System Integration Points

```
KnowledgeHub
├── Frontend (React)
│   ├── Google Drive API (file previews)
│   ├── Google Sheets API (data sync)
│   └── JWT tokens (auth)
│
├── Backend (Node.js)
│   ├── Google Sheets API (read/write)
│   ├── Google Drive API (file management)
│   ├── Database (Firebase/MongoDB)
│   ├── Cache (Redis/Node-Cache)
│   └── Email (SendGrid - optional)
│
└── External Services
    ├── Google Cloud Console (APIs)
    ├── GitHub (version control)
    ├── Vercel (frontend hosting)
    ├── Heroku/Railway (backend hosting)
    └── Monitoring (Sentry/NewRelic)
```

---

**Last Updated**: 2024-11-27
**Version**: 1.0.0
**Architecture**: Microservices-ready, Scalable, Secure
