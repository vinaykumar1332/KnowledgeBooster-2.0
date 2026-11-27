# KnowledgeHub - Complete Setup Guide

A modern knowledge-sharing platform for uploading and browsing study materials with an integrated Node.js backend.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- A **Google Account** for Drive/Sheets integration
- A code editor (VS Code recommended)

---

## 🚀 Quick Start (5 minutes)

### 1. Clone the Repository
```bash
cd c:\GITHUB
git clone <repo-url>
cd KnowledgeBooster-2.0
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 3. Create Environment Files

**Frontend** - Create `.env` in root:
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

**Backend** - Create `server/.env`:
```bash
cp server/.env.example server/.env
```

Then edit `server/.env` with your settings:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_local_dev_secret_key
FRONTEND_URL=http://localhost:5173
```

### 4. Run Both Servers

**Option A: Run in separate terminals**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd server
npm run dev
```

**Option B: Run together (requires npm-run-all)**
```bash
npm install -D npm-run-all
npm run dev:all
```

Frontend will be at: **http://localhost:5173**
Backend will be at: **http://localhost:3000**

---

## 📁 Project Structure

```
KnowledgeBooster-2.0/
├── src/                          # Frontend (React)
│   ├── components/               # Reusable components
│   ├── pages/                    # Page components
│   ├── services/                 # API services
│   ├── config/                   # Configuration
│   ├── styles/                   # CSS files (including responsive.css)
│   ├── utils/                    # Utility functions
│   └── App.jsx                   # Main App component
│
├── server/                       # Backend (Node.js Express)
│   ├── middleware/               # Express middleware
│   ├── routes/                   # API routes
│   ├── controllers/              # Business logic
│   ├── utils/                    # Utility functions
│   ├── server.js                 # Main server file
│   ├── .env.example              # Environment template
│   ├── package.json              # Backend dependencies
│   └── README.md                 # Backend documentation
│
├── public/                       # Static assets
├── package.json                  # Frontend dependencies
└── SETUP_GUIDE.md               # This file
```

---

## 🔐 Google Integration Setup

### 1. Create Google Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Google Drive API
   - Google Sheets API

### 2. Create API Keys

1. Go to **Credentials** → **Create Credentials** → **API Key**
2. Copy your **API Key**

### 3. Create OAuth 2.0 Credentials (Optional for Auth)

1. **Create Credentials** → **OAuth 2.0 Client IDs**
2. Set **Authorized redirect URIs**: `http://localhost:5173`
3. Download the credentials JSON

### 4. Update Environment Files

**Backend** (`server/.env`):
```env
GOOGLE_API_KEY=your_api_key_here
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## 📊 Google Sheet Setup

Your Google Sheet should have these columns:

```
| username | email | category | subcategory | title | description | driveUrl | fileid | thumbnailUrl | timestamp |
```

**Example:**
| username | email | category | subcategory | title | description | driveUrl | fileid |
|----------|-------|----------|-------------|-------|-------------|----------|--------|
| john_doe | john@example.com | student | Notes | React Hooks | Complete guide... | https://drive.google.com/file/d/... | FILE_ID_123 |

---

## 🎨 Customization

### Theme Colors (Black & White)

Edit `src/styles/variables.css`:

```css
:root {
    --kh-bg: #ffffff;              /* Background */
    --kh-text: #111111;            /* Text color */
    --kh-border: rgba(0, 0, 0, 0.10);  /* Border */
    --kh-accent: #111111;          /* Accent color */
}

[data-theme="dark"] {
    --kh-bg: #0f1115;              /* Dark background */
    --kh-text: #f0f3f8;            /* Dark text */
}
```

### Fonts

Default font: **Science Gothic** (available in `public/fonts/`)

To change:
```css
--kh-font-display: "Your Font", fallback;
--kh-font-body: "Your Font", fallback;
```

---

## 🔧 Development Workflow

### Frontend Development

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Backend Development

```bash
cd server
npm run dev              # Start with auto-reload (nodemon)
npm start                # Start production server
```

---

## 🧪 Testing

### Manual Testing

1. **Sign up** at `http://localhost:5173/signup`
2. **Upload a file** - Upload → Add Google Drive link
3. **Browse files** - View all uploaded files
4. **Search** - Search by title, category, or description

### API Testing (Postman/cURL)

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

**Get Files:**
```bash
curl http://localhost:3000/api/files?limit=20&offset=0
```

**Upload File:**
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"React Guide",
    "description":"Learn React",
    "category":"student",
    "subcategory":"Notes",
    "driveUrl":"https://drive.google.com/file/d/FILE_ID/view"
  }'
```

---

## 📱 Responsive Design

The app now includes **mobile-first responsive design** with breakpoints:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

Automatic adjustments for:
- Grid layouts (1→2→3 columns)
- Font sizes
- Touch-friendly buttons (48px minimum)
- Optimized spacing

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
npm run build
# Push to GitHub
# Deploy on Vercel automatically
```

### Deploy Backend (Heroku)
```bash
cd server
heroku create knowledgehub-api
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

### Deploy Backend (Railway)
```bash
railway link
railway up
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
Check `server/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Google Drive link not working
1. Ensure the file is shared: "Anyone with the link"
2. Check the URL format: `https://drive.google.com/file/d/FILE_ID/view`
3. Verify `GOOGLE_API_KEY` in `server/.env`

### Port already in use
```bash
# Frontend (port 5173)
npm run dev -- --port 5174

# Backend (port 3000)
PORT=3001 npm run dev
```

---

## 📚 Documentation

- **Frontend Architecture**: See individual component files
- **Backend API**: See `server/README.md`
- **Google Integration**: Check Google Cloud Console docs

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make changes
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Create a Pull Request

---

## 📝 Git Workflow

```bash
# Update your branch
git pull origin main

# Make changes
git add .
git commit -m "Descriptive message"
git push origin feature-name

# Create PR on GitHub
```

---

## ✅ Performance Checklist

- [x] Mobile-responsive design
- [x] Lazy loading for files
- [x] API caching (1 hour TTL)
- [x] Optimized images
- [x] Minified CSS/JS
- [x] Rate limiting on backend
- [x] Error handling
- [ ] Database optimization (Firebase/MongoDB)

---

## 🔒 Security Checklist

- [x] JWT authentication
- [x] CORS configuration
- [x] Rate limiting
- [x] Input validation
- [x] Password hashing (bcryptjs)
- [x] Security headers (Helmet.js)
- [ ] HTTPS in production
- [ ] Environment variables secured

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the backend docs: `server/README.md`
3. Open an issue on GitHub
4. Contact the team

---

## 📄 License

MIT License - See LICENSE file

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Set up Google integration
3. ✅ Create `.env` files
4. ✅ Run both servers
5. ✅ Test the application
6. ✅ Deploy to production

Happy coding! 🚀
