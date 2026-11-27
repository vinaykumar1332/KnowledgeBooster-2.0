# KnowledgeHub Backend Server

A Node.js Express REST API server for the KnowledgeHub file-sharing platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
Edit `.env` and set:
- `JWT_SECRET` - Your secret key for JWT tokens
- `GOOGLE_SHEET_ID` - Your Google Sheets ID
- `GOOGLE_API_KEY` - Your Google API key
- Other optional configurations

4. **Start the server:**

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All responses follow this format:
```json
{
  "status": "success|error",
  "message": "Human-readable message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔐 Authentication Routes

### Sign Up
**POST** `/auth/signup`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "confirmPassword": "secure_password"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGc...",
  "user": {
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "status": "success",
  "ok": true,
  "token": "eyJhbGc...",
  "user": {
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Verify Token
**POST** `/auth/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "ok": true,
  "user": {
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📁 Files Routes

### Get All Files
**GET** `/files?offset=0&limit=20&category=student`

**Query Parameters:**
- `offset` - Pagination offset (default: 0)
- `limit` - Number of files per page (default: 20)
- `category` - Filter by category (optional)

**Response:**
```json
{
  "status": "success",
  "ok": true,
  "rows": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "title": "React Hooks Overview",
      "description": "Comprehensive guide to React hooks",
      "category": "student",
      "subcategory": "Notes",
      "driveUrl": "https://drive.google.com/file/d/...",
      "fileid": "...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "hasMore": true
}
```

### Search Files
**GET** `/files/search?q=react&limit=20&offset=0`

**Query Parameters:**
- `q` - Search query (required)
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)

### Get File Details
**GET** `/files/:fileId`

### Upload File
**POST** `/files/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "React Hooks Overview",
  "description": "Comprehensive guide",
  "category": "student",
  "subcategory": "Notes",
  "driveUrl": "https://drive.google.com/file/d/FILE_ID/view"
}
```

### Update File
**PUT** `/files/:fileId`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "professional"
}
```

### Delete File
**DELETE** `/files/:fileId`

**Headers:**
```
Authorization: Bearer <token>
```

### Get User's Files
**GET** `/files/user/me?limit=20&offset=0`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🏥 Health Check

### Server Status
**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "uptime": 1234.56,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Detailed Health Info
**GET** `/health/detailed`

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Rate Limiting** - Prevent abuse (100 req/15min by default)
✅ **CORS** - Configured for frontend
✅ **Helmet.js** - Security headers
✅ **Input Validation** - Server-side validation
✅ **Password Hashing** - bcryptjs
✅ **Error Handling** - Comprehensive error handling

---

## 📊 Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **Auth Endpoints**: 5 requests per 15 minutes per IP
- **Search Endpoints**: 300 requests per 15 minutes per IP

---

## 🛠️ Development

### Project Structure
```
server/
├── middleware/           - Express middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   ├── requestLogger.js
│   └── securityHeaders.js
├── routes/              - API route handlers
│   ├── auth.routes.js
│   ├── files.routes.js
│   └── health.routes.js
├── controllers/         - Business logic
│   ├── authController.js
│   └── filesController.js
├── utils/               - Utility functions
│   └── validators.js
├── server.js            - Main entry point
├── package.json
├── .env.example
└── README.md
```

### Adding New Endpoints

1. **Create a new route** in `routes/` directory
2. **Create corresponding controller** in `controllers/` directory
3. **Import and use** in `server.js`

---

## 🚀 Deployment

### Heroku
```bash
heroku create knowledgehub-api
git push heroku main
```

### Railway
```bash
railway link
railway up
```

### Vercel Functions
Already configured in `/api` directory

---

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `JWT_SECRET` | Secret key for JWT | (required in prod) |
| `JWT_EXPIRE` | Token expiration time | 7d |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Requests per window | 100 |

---

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 📞 Support

For issues or questions, open an issue on GitHub or contact the team.
