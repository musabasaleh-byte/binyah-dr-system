// BINYAH DR SYSTEM — Firebase Config

const firebaseConfig = {
  apiKey: "AIzaSyBOkBV9wzg0oFR5RbN7Te1R3UCwpcvZcc4",
  authDomain: "binyah-dr-system-77705.firebaseapp.com",
  projectId: "binyah-dr-system-77705",
  storageBucket: "binyah-dr-system-77705.firebasestorage.app",
  messagingSenderId: "261726284404",
  appId: "1:261726284404:web:3fe5035fba618fa4c77f21"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Offline not supported');
  }
});

console.log('BINYAH DR System connected');
