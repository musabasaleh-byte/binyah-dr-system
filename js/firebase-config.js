// ╔══════════════════════════════════════════════════════════════╗
// ║  BINYAH DR SYSTEM — Firebase Config (GitHub Pages Version)  ║
// ║                                                              ║
// ║  ⚠️  REPLACE values below with YOUR Firebase project config ║
// ║  Steps: console.firebase.google.com → Your Project →        ║
// ║         Project Settings ⚙️ → General → Web App → Config    ║
// ╚══════════════════════════════════════════════════════════════╝

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY_HERE",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore (cloud database) + Storage (photos)
const db      = firebase.firestore();
const storage = firebase.storage();

// Enable offline — inspectors can fill forms without internet
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Offline not supported in this browser');
  }
});

console.log('🔥 BINYAH DR System connected to Firebase');
