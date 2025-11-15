

const firebaseConfig = {
apiKey: "SUA_KEY",
authDomain: "...",
projectId: "...",
storageBucket: "...",
messagingSenderId: "...",
appId: "..."
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
