// Main application initialization and coordination

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initApp();
});

// Initialize the application
function initApp() {
  // Check if Firebase is initialized
  if (!firebase.apps.length) {
    console.error('Firebase not initialized. Please check your configuration.');
    alert('Error initializing application. Please check console for details.');
    return;
  }
  
  console.log('Admin Validation Portal initialized');
  
  // Firebase Auth state will be handled in auth.js
  // Dashboard functionality will be handled in dashboard.js
  
  // Add any global event listeners or initialization here
  
  // Handle errors globally
  window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
  });
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
  // You could implement a toast notification system here
  // For now, we'll use alert
  alert(message);
}
