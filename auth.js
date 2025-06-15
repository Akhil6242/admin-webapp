
// Authentication functionality for the Admin Validation Portal
// DOM Elements
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const otpForm = document.getElementById('otp-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const otpInput = document.getElementById('otp');
const loginBtn = document.getElementById('login-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const resendOtpBtn = document.getElementById('resend-otp-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminNameElement = document.getElementById('admin-name');

// Current admin data
let currentAdmin = null;
let currentPhone = null;

// Initialize authentication state
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    fetchAdminData(user.email);
  } else {
    // User is signed out
    showLoginForm();
  }
});

// Show login form
function showLoginForm() {
  loginContainer.classList.remove('hidden');
  dashboardContainer.classList.add('hidden');
  loginForm.classList.remove('hidden');
  otpForm.classList.add('hidden');
  
  // Clear inputs
  emailInput.value = '';
  passwordInput.value = '';
  otpInput.value = '';
}

// Show OTP form
function showOtpForm() {
  loginForm.classList.add('hidden');
  otpForm.classList.remove('hidden');
}

// Show dashboard
function showDashboard() {
  loginContainer.classList.add('hidden');
  dashboardContainer.classList.remove('hidden');
  
  // Update admin name in dashboard
  if (currentAdmin) {
    adminNameElement.textContent = currentAdmin.Name || 'Admin';
  }
  
  // Load dashboard data
  loadUserData();
}

// Fetch admin data from Firestore
async function fetchAdminData(email) {
  try {
    console.log("Attempting to fetch admin with username:", email);
    const adminSnapshot = await adminCollection.where('username', '==', email).get();

    console.log("Query result empty?", adminSnapshot.empty);
    
    if (adminSnapshot.empty) {
      console.error('No admin found with this email');
      alert('No admin account found with this email');
      firebase.auth().signOut();
      return;
    }
    
    // Get admin data
    currentAdmin = adminSnapshot.docs[0].data();
    currentPhone = currentAdmin.phone;
    
    // Check if OTP verification is required
    if (currentAdmin.otpVerified) {
      showDashboard();
    } else {
      // Send OTP for verification
      sendOTP(currentPhone);
      showOtpForm();
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
    alert('Error fetching admin data. Please try again.');
  }
}

// Send OTP to admin's phone
function sendOTP(phoneNumber) {
  // In a real implementation, you would use Firebase Phone Authentication
  // or a service like Twilio to send an OTP to the admin's phone
  
  // For demo purposes, we'll simulate OTP sending
  console.log(`OTP sent to ${phoneNumber}`);
  
  // Show notification to user
  alert(`An OTP has been sent to your registered phone number: ${phoneNumber}`);
}

// Verify OTP
function verifyOTP(otp) {
  // In a real implementation, you would verify the OTP with Firebase Phone Authentication
  // or your backend service
  
  // For demo purposes, we'll accept any 6-digit OTP
  if (otp.length === 6 && /^\d+$/.test(otp)) {
    // Update admin document to mark OTP as verified
    const adminDoc = adminCollection.where('username', '==', currentAdmin.username).limit(1);
    
    adminDoc.get().then((snapshot) => {
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        adminCollection.doc(docId).update({
          otpVerified: true
        }).then(() => {
          currentAdmin.otpVerified = true;
          showDashboard();
        }).catch((error) => {
          console.error('Error updating admin document:', error);
          alert('Error verifying OTP. Please try again.');
        });
      }
    });
  } else {
    alert('Invalid OTP. Please enter a valid 6-digit code.');
  }
}

// Event Listeners
loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }
  console.log("Attempting to sign in with:", email);
  // Sign in with Firebase Auth
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Successfully signed in
      console.log("Authentication successful:", userCredential.user.email);
    })
    .catch(function(error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    });
});

verifyOtpBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  const otp = otpInput.value.trim();
  
  if (!otp) {
    alert('Please enter the OTP');
    return;
  }
  
  verifyOTP(otp);
});

resendOtpBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  if (currentPhone) {
    sendOTP(currentPhone);
  } else {
    alert('Unable to resend OTP. Please refresh and try again.');
  }
});

logoutBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  firebase.auth().signOut().then(function() {
    // Sign-out successful
    currentAdmin = null;
    currentPhone = null;
    showLoginForm();
  }).catch(function(error) {
    // An error happened
    console.error('Logout error:', error);
  });
});
