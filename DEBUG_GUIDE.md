# Debugging & Troubleshooting Guide

**Step-by-step guide to fix connection issues** 🔧

---

## 🚨 **Issue: `net::ERR_CONNECTION_REFUSED`**

**Cause**: Frontend trying to connect to backend, but backend is NOT running.

### **Fix**

**Step 1: Start Backend**

```bash
cd c:\GITHUB\KnowledgeBooster-2.0\server
node server-simple.js
```

You should see:
```
============================================================
🚀 KnowledgeHub Backend Server Started
============================================================
📍 Environment: development
🔗 URL: http://localhost:3000
📡 API: http://localhost:3000/api
🌐 Frontend: http://localhost:5173
============================================================
```

**Step 2: Verify Backend is Running**

Open browser: `http://localhost:3000/`

Should show:
```json
{
  "status": "success",
  "message": "KnowledgeHub Backend Server"
}
```

If you see this ✅, backend is running!

---

## 🔍 **Issue: `http://localhost:3000/` Shows Nothing**

### **Possible Causes**

1. **Port already in use**
2. **Dependencies not installed**
3. **Node.js not installed**

### **Fix**

#### **Check if Node.js is installed**

```bash
node --version
npm --version
```

Should show versions like `v18.0.0` and `9.0.0`

If not: [Download Node.js](https://nodejs.org/)

#### **Check if port 3000 is in use**

```bash
netstat -ano | findstr :3000
```

If you see a PID, kill it:

```bash
taskkill /PID <PID> /F
```

#### **Install dependencies**

```bash
cd c:\GITHUB\KnowledgeBooster-2.0\server
npm install
```

#### **Try again**

```bash
node server-simple.js
```

---

## 📝 **Issue: Login Page Shows Errors**

### **Check 1: Frontend Console Errors**

1. Open browser DevTools: `F12`
2. Go to **Console** tab
3. Look for red error messages

#### **If you see: `GET http://localhost:3000/api/health 404`**

**Solution**: Backend is NOT on port 3000

Check:
1. Is backend running? (`node server-simple.js`)
2. Is it on port 3000? (Check terminal output)

#### **If you see: `net::ERR_CONNECTION_REFUSED`**

**Solution**: Backend is NOT running

```bash
cd server
node server-simple.js
```

#### **If you see: `CORS error`**

**Solution**: Backend CORS config is wrong

Check `server/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

If wrong, update and restart backend.

### **Check 2: Network Tab**

1. Open DevTools: `F12`
2. Go to **Network** tab
3. Try logging in
4. Look at failed requests

**Check each request**:
- **Status**: Should be 200 or 201 (not 404 or 500)
- **URL**: Should point to `http://localhost:3000/api/...`
- **Headers**: Should have `Content-Type: application/json`

---

## 🧪 **Test Login Step by Step**

### **Step 1: Test Backend Directly**

**Check health:**
```bash
curl http://localhost:3000/api/health
```

Should return healthy status ✅

### **Step 2: Test Sign Up**

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

**Should return:**
```json
{
  "status": "success",
  "ok": true,
  "token": "...",
  "user": {
    "username": "Test User",
    "email": "test@example.com"
  }
}
```

If NOT:
- Check backend terminal for errors
- Check request format
- Try restarting backend

### **Step 3: Test Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test@example.com\",
    \"password\": \"password123\"
  }"
```

**Should return token** ✅

If NOT:
- Check if user exists (run Step 2 first)
- Check password matches
- Check backend logs

### **Step 4: Test Frontend Login**

1. Go to `http://localhost:5173/login`
2. Enter credentials from Step 2
3. Click Sign In

Should redirect to `/home` ✅

---

## 🔐 **Issue: Token Not Saved**

**Cause**: Token not being stored in sessionStorage

### **Fix**

**Check DevTools**:
1. Open DevTools: `F12`
2. Go to **Application** tab
3. Check **Session Storage**
4. Look for key `auth`

**If NOT there**:
- Check browser console for errors
- Check network response has `token` field
- Try different browser/incognito window

---

## 🚫 **Issue: 404 Errors on API Endpoints**

**Cause**: Backend routes not defined or wrong URL

### **Check**

**Expected URLs**:
```
POST   http://localhost:3000/api/auth/login
POST   http://localhost:3000/api/auth/signup
GET    http://localhost:3000/api/files
POST   http://localhost:3000/api/files/upload
```

**If getting 404**:
1. Check exact URL in Network tab
2. Verify backend routes are defined
3. Restart backend

---

## 💾 **Issue: Files Not Saving**

### **Causes & Fixes**

| Issue | Fix |
|-------|-----|
| **`401 Unauthorized`** | Token not being sent. Check `Authorization` header |
| **`400 Bad Request`** | Missing required fields (title, driveUrl) |
| **`500 Server Error`** | Backend crashed. Check terminal logs |
| **`Connection refused`** | Backend not running. Start it |

### **Test File Upload**

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{
    \"title\": \"Test File\",
    \"description\": \"Test\",
    \"category\": \"student\",
    \"subcategory\": \"Notes\",
    \"driveUrl\": \"https://drive.google.com/file/d/FAKE_ID/view\"
  }"
```

Replace `<TOKEN>` with token from login!

---

## 📊 **Backend Logs**

### **What You Should See**

```
✅ POST /api/auth/login         (Successful login)
✅ GET /api/files               (Got files)
✅ POST /api/files/upload       (File uploaded)
🔴 401 POST /api/auth/verify    (Invalid token)
```

### **If You See Errors**

```
Cannot find module...     → npm install
SyntaxError...           → Check file syntax
EADDRINUSE...            → Port in use, kill it
```

---

## 🔧 **Quick Restart Process**

**When things break**:

```bash
# Terminal 1: Kill everything
# (Ctrl+C to stop server)

# Terminal 2: Kill frontend
# (Ctrl+C to stop)

# Wait 5 seconds

# Terminal 1: Restart backend
cd c:\GITHUB\KnowledgeBooster-2.0\server
node server-simple.js

# Terminal 2: Restart frontend (wait for backend ready)
cd c:\GITHUB\KnowledgeBooster-2.0
npm run dev

# Browser: Reload page (Ctrl+R)
# Hard reload (Ctrl+Shift+R)
```

---

## 📱 **Browser DevTools Tips**

### **Network Tab**

1. Open DevTools: `F12` → **Network**
2. Click action (login, upload)
3. Check request/response:
   - **Status**: 200/201 = OK, 400/401/500 = Error
   - **Headers**: Check Content-Type
   - **Response**: Check JSON data

### **Console Tab**

Shows errors in red. Look for:
- `GET ... 404` - Endpoint not found
- `POST ... 500` - Server error
- `net::ERR_CONNECTION_REFUSED` - Server not running
- `CORS error` - Origin not allowed

### **Application Tab**

Check storage:
- **Session Storage** → `auth` key should have token
- **Local Storage** → Check saved preferences

### **Clear Everything**

```
DevTools → Application → Clear site data
```

Then reload page and try again.

---

## 🎯 **Checklist Before Testing**

- [ ] Backend running (`node server-simple.js`)
- [ ] Frontend running (`npm run dev`)
- [ ] No errors in console
- [ ] Can access `http://localhost:3000/`
- [ ] Can access `http://localhost:5173/`
- [ ] Can see `/api/health` returns healthy
- [ ] Browser DevTools open (ready to debug)

---

## 🆘 **Still Not Working?**

### **Provide These Details**

1. **Backend terminal output** (what it shows when starting)
2. **Frontend console error** (F12 → Console → red errors)
3. **Network response** (F12 → Network → failed request → Response tab)
4. **Backend log** (what appears when you try login)

---

## 🚀 **Success Indicators**

✅ Backend starts without errors
✅ `http://localhost:3000/` returns JSON
✅ `http://localhost:3000/api/health` returns healthy
✅ Frontend can reach backend
✅ Sign up works without errors
✅ Login works and redirects to /home
✅ Token appears in sessionStorage
✅ Files can be uploaded

**Once all ✅, you're ready to go!**

---

## 🔗 **Full Integration Test**

```
1. Start backend       → check localhost:3000
2. Start frontend      → check localhost:5173
3. Open browser dev    → F12 → Console
4. Go to login page    → /login
5. Sign up new user    → check response
6. Login               → should work
7. Check storage       → auth token saved
8. Go to upload        → try upload
9. Go to browse        → see files
```

**If all works → Integration is GOOD!** ✅

---

**Problems? Let me know the exact error message and I'll help!** 💪
