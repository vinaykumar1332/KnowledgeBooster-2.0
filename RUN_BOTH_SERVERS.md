# ▶️ Run Both Servers - Complete Guide

**Get everything running with ONE command!** 🚀

---

## ⚡ **Quick Start (2 Steps)**

### **Step 1: First Time Setup**

```bash
npm run setup
cd server
cp .env.example .env
cd ..
npm install concurrently
```

**Expected output:**
```
✅ Setup complete!
```

### **Step 2: Run Everything**

```bash
npm run dev:full
```

**Wait for output:**
```
🚀 KnowledgeHub Backend Server Started
➜  Local:   http://localhost:5173/
```

---

## ✅ **Verify Everything Works**

**After both servers start, run (in new terminal):**

```bash
node verify-setup.js
```

**Expected output:**
```
✅ Backend is running on http://localhost:3000
✅ Frontend is running on http://localhost:5173
✅ All systems operational!
```

---

## 📋 **Available Commands**

### **Run Everything Together (RECOMMENDED)**
```bash
npm run dev:full
```
Runs frontend + backend simple server in one command ✅

### **Run Frontend Only**
```bash
npm run dev:frontend
```
Just the React frontend on port 5173

### **Run Backend Only (Simple)**
```bash
npm run dev:backend:simple
```
Just the backend on port 3000 (easy to debug)

### **Run Backend Only (Full)**
```bash
npm run dev:backend:full
```
Just the backend with all middleware (needs all deps)

### **Run All (Alternative)**
```bash
npm run dev:all
```
Same as `npm run dev:full` - runs both servers

### **Quick Alias**
```bash
npm start
```
Same as `npm run dev:full` - super quick

---

## 🔄 **What Happens When You Run `npm run dev:full`**

```
1. npm installs concurrently (if needed)
   ↓
2. Starts backend server: node server/server-simple.js
   ↓ (waits 2 seconds for backend to start)
3. Starts frontend server: vite
   ↓
4. Both run simultaneously
   ↓
5. Backend output on left
   Frontend output on right
```

---

## 📱 **Test After Starting**

### **Backend Health Check**
```
Browser: http://localhost:3000/api/health
```

Should show:
```json
{
  "status": "healthy",
  "message": "Server is running"
}
```

### **Frontend Login**
```
Browser: http://localhost:5173/login
```

Try:
1. Sign up with any email/password
2. Login
3. Should redirect to home

### **API Test**
```bash
curl http://localhost:3000/api/health
```

Should respond immediately with JSON ✅

---

## 🛠️ **Troubleshooting**

### **Issue: `npm: command not found`**

Node.js not installed. Download from: https://nodejs.org/

### **Issue: `Port 3000 already in use`**

Another process is using port 3000:

```bash
# Windows CMD
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Windows PowerShell
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force

# Then run dev:full again
```

### **Issue: `concurrently: command not found`**

Install it:

```bash
npm install concurrently
npm run dev:full
```

### **Issue: Backend doesn't start**

```bash
# Check if dependencies are installed
cd server
npm install

# Then try starting backend directly
node server-simple.js

# If you see error about missing module
npm install
node server-simple.js
```

### **Issue: Frontend errors in console**

Check DevTools (F12):
1. Console tab → Red errors?
2. Network tab → Check API calls
3. Hard reload → Ctrl+Shift+R

---

## 📊 **Expected Terminal Output**

### **Backend (Left Side)**
```
============================================================
🚀 KnowledgeHub Backend Server Started
============================================================
📍 Environment: development
🔗 URL: http://localhost:3000
📡 API: http://localhost:3000/api
🌐 Frontend: http://localhost:5173
============================================================

✅ GET /api/health
✅ GET /
```

### **Frontend (Right Side)**
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

---

## 🎯 **Full Workflow**

```bash
# Step 1: One-time setup
npm run setup
cd server && cp .env.example .env && cd ..

# Step 2: Install concurrently
npm install concurrently

# Step 3: Run everything!
npm run dev:full

# Step 4: Open browser
# http://localhost:5173/login

# Step 5: Test (in new terminal)
node verify-setup.js
```

**All ✅? You're ready!** 🎉

---

## 🔐 **Security Notes**

**For Development Only:**
- Backend runs on localhost:3000
- Frontend runs on localhost:5173
- CORS is configured
- Tokens are in-memory

**For Production:**
- Use HTTPS
- Real database
- Proper JWT signing
- Rate limiting
- Security headers

---

## 📚 **More Commands**

```bash
# Setup everything fresh
npm run setup

# Just check if everything works
node verify-setup.js

# Build for production
npm run build

# Check code quality
npm run lint

# View built app
npm run preview
```

---

## 🚀 **That's It!**

**One command to rule them all:**

```bash
npm run dev:full
```

Then open: `http://localhost:5173/login`

Enjoy your KnowledgeHub! 🎉

---

## 🆘 **Still Having Issues?**

1. **Read** `DEBUG_GUIDE.md` for detailed troubleshooting
2. **Check** both terminal outputs for errors
3. **Verify** with `node verify-setup.js`
4. **Clear cache** - Ctrl+Shift+R in browser
5. **Restart** - Ctrl+C both servers, run `npm run dev:full` again

---

**Last Updated**: 2024-11-27
**Version**: 1.0.0
**Status**: ✅ Ready to Use
