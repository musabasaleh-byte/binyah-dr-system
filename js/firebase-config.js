// ╔══════════════════════════════════════════════════════════════╗
// ║  BINYAH DR SYSTEM — Firebase Config (GitHub Pages Version)  ║
// ║                                                              ║
// ║  ⚠️  REPLACE values below with YOUR Firebase project config ║
// ║  Steps: console.firebase.google.com → Your Project →        ║
// ║         Project Settings ⚙️ → General → Web App → Config    ║
// ╚══════════════════════════════════════════════════════════════╝

const firebaseConfig = {
  apiKey: "AIzaSyBOkBV9wzg0oFR5RbN7TelR3UCwpcvZcc4",
  authDomain: "binyah-dr-system-77705.firebaseapp.com",
  projectId: "binyah-dr-system-77705",
  storageBucket: "binyah-dr-system-77705.firebasestorage.app",
  messagingSenderId: "261726284404",
  appId: "1:261726284404:web:3fe5035fba618fa4c77f21"
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
