
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYIPeYip_r1uqJuB2sveh9dJ5Vzd07MIo",
  authDomain: "collegecampusapp-apas653.firebaseapp.com",
  projectId: "collegecampusapp-apas653",
  storageBucket: "collegecampusapp-apas653.firebasestorage.app",
  messagingSenderId: "549202264660",
  appId: "1:549202264660:web:7a503525b201910a00e3c1",
  measurementId: "G-LECKTR7ZK5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Collections references
const adminCollection = db.collection('admin_webapp');
const usersCollection = db.collection('Registration_userdata');
const verifiedUsersCollection = db.collection('verifiedUser');
