# Quick Start - Backend Server Setup

**Get the backend running in 5 minutes** ⚡

---

## 🚀 **Step 1: Install Dependencies** (1 minute)

```bash
cd c:\GITHUB\KnowledgeBooster-2.0\server
npm install
```

**Expected output:**
```
added XX packages
```

If you see errors, try:
```bash
npm install --legacy-peer-deps
```

---

## 🔧 **Step 2: Create .env File** (1 minute)

Create `server/.env`:

```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=test_secret_key_local_dev
```

---

## ▶️ **Step 3: Start Backend Server** (1 minute)

**Option A: Use simplified server (RECOMMENDED - Easier to debug)**

```bash
cd c:\GITHUB\KnowledgeBooster-2.0\server
node server-simple.js
```

**Option B: Use full server (with all middleware)**

```bash
cd c:\GITHUB\KnowledgeBooster-2.0\server
npm run dev
```

---

## ✅ **Verify It's Running**

Open your browser and go to:

### **1. Main endpoint**
```
http://localhost:3000/
```

Should show:
```json
{
  "status": "success",
  "message": "KnowledgeHub Backend Server",
  "version": "1.0.0"
}
```

### **2. Health check**
```
http://localhost:3000/api/health
```

Should show:
```json
{
  "status": "healthy",
  "message": "Server is running"
}
```

✅ **If you see these - Backend is working!**

---

## 🌐 **Step 4: Run Frontend** (1 minute)

**In a new terminal:**

```bash
cd c:\GITHUB\KnowledgeBooster-2.0
npm run dev
```

Frontend will be at: `http://localhost:5173`

---

## 🧪 **Step 5: Test Integration**

Go to: `http://localhost:5173/login`

### **Test Sign Up:**

1. Click "Sign up" link
2. Fill in:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: password123
   - **Confirm**: password123
3. Click "Create Account"

**Should succeed!** ✅

### **Test Login:**

1. Go back to login
2. Enter:
   - **Email**: test@example.com
   - **Password**: password123
3. Click "Sign In"

**Should redirect to /home!** ✅

---

## 🔍 **Troubleshooting**

### **Error: `EADDRINUSE :::3000`**

Port 3000 is in use. Kill it:

**Windows CMD:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Windows PowerShell:**
```bash
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

### **Error: `Cannot find module`**

Backend dependencies not installed:

```bash
cd server
rm -r node_modules
npm install
```

### **Error: `net::ERR_CONNECTION_REFUSED`**

Backend is not running:

1. Check terminal where backend started
2. Look for errors
3. Try simplified server: `node server-simple.js`

### **Error: `CORS error`**

Check `server/.env` has correct `FRONTEND_URL`:

```env
FRONTEND_URL=http://localhost:5173
```

---

## 📋 **Testing API Endpoints**

Use these commands to test manually:

### **Sign Up (using curl or Postman)**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"Test User\",
    \"email\": \"test@example.com\",
    \"password\": \"password123\",
    \"confirmPassword\": \"password123\"
  }"
```

### **Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test@example.com\",
    \"password\": \"password123\"
  }"
```

**Response includes token:**
```json
{
  "status": "success",
  "ok": true,
  "token": "eyJhbGc..."
}
```

### **Get Current User (using token)**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

### **Get All Files**

```bash
curl http://localhost:3000/api/files?limit=20
```

### **Upload File (requires auth)**

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"title\": \"React Guide\",
    \"description\": \"Learning React\",
    \"category\": \"student\",
    \"subcategory\": \"Notes\",
    \"driveUrl\": \"https://drive.google.com/file/d/FILE_ID/view\"
  }"
```

---

## 🎯 **Full Workflow**

```
1. Terminal 1: cd server && node server-simple.js
   ↓ Wait for "Server Started" message
   
2. Terminal 2: npm run dev
   ↓ Wait for frontend to start
   
3. Browser: http://localhost:5173
   ↓ Click signup/login
   
4. Test features
   ✅ All working!
```

---

## 📚 **What's Different**

### **server-simple.js**
- ✅ Minimal dependencies
- ✅ Easy to debug
- ✅ Works immediately
- ✅ No complex imports
- ✅ Perfect for development

### **server.js** (full version)
- ✅ Full middleware stack
- ✅ Security headers
- ✅ Rate limiting
- ✅ Error handling
- ✅ Production-ready

**Use `server-simple.js` for quick testing, `server.js` for production.**

---

## 🔐 **Security Notes**

**For Development Only:**
- ✅ Tokens are base64 (easy to decode)
- ✅ Passwords stored plain (NOT for production)
- ✅ No encryption

**For Production:**
- ✅ Use JWT with proper signatures
- ✅ Hash passwords with bcryptjs
- ✅ Enable HTTPS
- ✅ Use rate limiting
- ✅ Implement real database

---

## 🛠️ **Useful Commands**

```bash
# Start simplified backend (BEST FOR NOW)
node server-simple.js

# Start full backend (with all middleware)
npm run dev

# Check if port is in use
netstat -ano | findstr :3000

# Kill process on port
taskkill /PID <PID> /F

# Reset backend
rm -r node_modules && npm install

# Test backend health
curl http://localhost:3000/api/health
```

---

## ✅ **Checklist**

- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created with PORT=3000
- [ ] Backend server running (`node server-simple.js`)
- [ ] `http://localhost:3000/` shows success message
- [ ] `http://localhost:3000/api/health` returns healthy
- [ ] Frontend server running (`npm run dev`)
- [ ] Can access `http://localhost:5173`
- [ ] Sign up works
- [ ] Login works
- [ ] Token is generated and stored

---

## 🎉 **You're Ready!**

Once all tests pass, your full stack is running:

✅ **Frontend** - React with new components  
✅ **Backend** - Express server with API  
✅ **Integration** - Frontend ↔ Backend communication  
✅ **Storage** - In-memory (users & files)  

**Next steps:**
1. Test all features
2. Connect to Google Sheets
3. Deploy to production

---

**Problems? Let me know the error message and I'll help fix it!** 🚀
