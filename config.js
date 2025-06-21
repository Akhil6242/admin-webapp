
// Firebase configuration
const firebaseConfig = {
  apiKey: "API key is a concern for secrecy",// college authorities denied to share now till college denies the project
  authDomain: "collegecampusapp-apas653.firebaseapp.com",
  projectId: "collegecampusapp-apas653",
  storageBucket: "collegecampusapp-apas653.firebasestorage.app",
  messagingSenderId: "xxxxxxxx660",
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
