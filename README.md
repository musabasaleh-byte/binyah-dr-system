# BINYAH DR Management System
## GitHub Pages + Firebase Firestore (Free)

**Hosting:** GitHub Pages (free)  
**Database:** Firebase Firestore (free cloud database)  
**Cost:** $0/month  

---

## 🚀 SETUP (15 minutes total)

### PART A — Firebase Database (5 min)

You still need Firebase for the **cloud database** (so Dashboard and Form share data).  
GitHub Pages = hosting only. Firebase = database only.

1. Go to **https://console.firebase.google.com**
2. Click **Create a project** → Name: `binyah-dr-system` → Create
3. Click the **Web icon** `</>` → Register name: `BINYAH DR` → Register
4. **COPY the `firebaseConfig` object** shown on screen

5. Enable **Firestore:**
   - Left menu → Build → **Firestore Database** → Create Database
   - Select **Start in test mode**
   - Location: **me-central2** (closest to Riyadh)
   - Click Enable

6. Enable **Storage** (for photos):
   - Left menu → Build → **Storage** → Get Started → Next → Done

7. Open the file **`js/firebase-config.js`** and paste your config:
   ```javascript
   const firebaseConfig = {
     apiKey:            "AIzaSyB...",      // ← your key
     authDomain:        "binyah-dr-system.firebaseapp.com",
     projectId:         "binyah-dr-system",
     storageBucket:     "binyah-dr-system.firebasestorage.app",
     messagingSenderId: "123456789",
     appId:             "1:123456789:web:abc..."
   };
   ```

---

### PART B — GitHub Pages (5 min)

**Option 1: Using GitHub Website (No coding)**

1. Go to **https://github.com** → Sign in (or create account)
2. Click **+** → **New repository**
3. Name: `binyah-dr-system` → **Public** → Create
4. Click **"uploading an existing file"** link
5. **Drag all files** from this folder into the upload area:
   - `index.html`
   - `form.html`
   - `js/` folder (with firebase-config.js and dr-service.js)
6. Click **Commit changes**
7. Go to **Settings** → **Pages** (left sidebar)
8. Source: **Deploy from a branch**
9. Branch: **main** → Folder: **/ (root)** → **Save**
10. Wait 1-2 minutes → Your site is live at:

   **`https://YOUR-USERNAME.github.io/binyah-dr-system/`**

---

**Option 2: Using Git (Command Line)**

```bash
# 1. Initialize git in this folder
cd binyah-dr-github
git init
git add .
git commit -m "BINYAH DR System"

# 2. Create repo on GitHub, then push
git remote add origin https://github.com/YOUR-USERNAME/binyah-dr-system.git
git branch -M main
git push -u origin main

# 3. Enable GitHub Pages
# Go to: Settings → Pages → Branch: main → / (root) → Save
```

---

## ✅ DONE — YOUR URLs

| Page | URL |
|------|-----|
| Dashboard | `https://YOUR-USERNAME.github.io/binyah-dr-system/` |
| New DR Form | `https://YOUR-USERNAME.github.io/binyah-dr-system/form.html` |

Share these links with your team. Works on any phone, tablet, or laptop.

---

## 📱 INSTALL AS PHONE APP

1. Open your site URL on phone browser (Chrome/Safari)
2. Chrome: tap ⋮ menu → **"Add to Home Screen"**
3. Safari: tap Share → **"Add to Home Screen"**
4. App icon appears — opens like a native app

---

## 🔄 HOW THE SYNC WORKS

```
Inspector opens form.html → fills DR → clicks Submit
         ↓
    Saves to Firebase Firestore (cloud)
         ↓
    Dashboard index.html has onSnapshot() listener
         ↓
    Dashboard INSTANTLY updates (charts + table + stats)
         ↓
    Toast notification: "DR-0045 added!"
```

Click any DR row in Dashboard → Opens form.html?id=xxx → Edit & save back

---

## 📁 FILES

```
binyah-dr-github/
├── index.html              ← Dashboard (main page)
├── form.html               ← DR Closure Report Form  
├── README.md               ← This file
└── js/
    ├── firebase-config.js  ← ⚠️ UPDATE WITH YOUR CONFIG
    └── dr-service.js       ← Shared data service
```

Only 4 files. That's it.

---

## 🔧 UPDATING YOUR SITE

After making changes:

**Via GitHub website:**
- Edit files directly on github.com → Commit → Auto-deploys in ~1 min

**Via Git:**
```bash
git add .
git commit -m "Update"
git push
```
GitHub Pages auto-deploys after each push.
