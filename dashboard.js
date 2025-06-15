// Dashboard functionality for the Admin Validation Portal

// DOM Elements
const usersTableBody = document.getElementById('users-table-body');
const userRowTemplate = document.getElementById('user-row-template');
const loadingIndicator = document.getElementById('loading-indicator');
const noDataMessage = document.getElementById('no-data-message');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');

// Store users data
let allUsers = [];

// Load user data from Firestore
async function loadUserData() {
  showLoading(true);
  
  try {
    // Get all users from the 'users' collection
    const usersSnapshot = await usersCollection.get();
    
    if (usersSnapshot.empty) {
      showNoData(true);
      allUsers = [];
    } else {
      allUsers = usersSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
          status: 'pending' // Default status for users in the 'users' collection
        };
      });
      
      // Get verified users to update status
      const verifiedSnapshot = await verifiedUsersCollection.get();
      const verifiedIds = new Set();
      
      verifiedSnapshot.forEach(doc => {
        const data = doc.data();
        // Assuming there's some field that can link to the original user
        // This could be email, registration number, or any unique identifier
        if (data.username) {
          verifiedIds.add(data.username.toLowerCase());
        }
      });
      
      // Update status for verified users
      allUsers = allUsers.map(user => {
        if (user.Email && verifiedIds.has(user.Email.toLowerCase())) {
          return { ...user, status: 'verified' };
        }
        return user;
      });
      
      // Display users
      displayUsers(allUsers);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    alert('Error loading user data. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Display users in the table
function displayUsers(users) {
  // Clear existing rows
  usersTableBody.innerHTML = '';
  
  if (users.length === 0) {
    showNoData(true);
    return;
  }
  
  showNoData(false);
  
  // Add user rows
  users.forEach(user => {
    const row = createUserRow(user);
    usersTableBody.appendChild(row);
  });
}

// Create a table row for a user
function createUserRow(user) {
  // Clone the template
  const row = document.importNode(userRowTemplate.content, true).querySelector('tr');
  
  // Set user data
  row.querySelector('.user-name').textContent = user.Name || '';
  row.querySelector('.user-reg-no').textContent = user['RegistrationNumber'] || '';
  row.querySelector('.user-course').textContent = user.Course || '';
  row.querySelector('.user-year').textContent = user.Year || '';
  row.querySelector('.user-mobile').textContent = user['Mobile_Number'] || '';
  row.querySelector('.user-email').textContent = user.Email || '';
  
  // Set data attribute for user ID
  row.dataset.userId = user.id;
  row.dataset.userEmail = user.Email || '';
  
  // Set up action buttons
  const approveBtn = row.querySelector('.approve-btn');
  
  // Disable buttons for already verified users
  if (user.status === 'verified') {
    approveBtn.disabled = true;
    approveBtn.textContent = 'Validated';
  } else {
    // Add event listeners
    approveBtn.addEventListener('click', () => validateUser(user));
  }
  
  return row;
}

// Validate a user
async function validateUser(user) {
  if (!confirm(`Are you sure you want to validate ${user.Name}?`)) {
    return;
  }
  
  try {
    // Add user to verified users collection
    await verifiedUsersCollection.add({
      username: user.Email,
      'RegistrationNumber': user['RegistrationNumber'],
      Name: user.Name,
      Course: user.Course,
      'Mobile_Number': user['Mobile_Number'],
      Year: user.Year

    });
    
    // Update UI
    alert(`${user.Name} has been validated successfully.`);
    
    // Reload user data
    loadUserData();
  } catch (error) {
    console.error('Error validating user:', error);
    alert('Error validating user. Please try again.');
  }
}


// Filter and search functionality
function filterUsers() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;
  
  let filteredUsers = allUsers;
  
  // Apply status filter
  if (filterValue !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === filterValue);
  }
  
  // Apply search filter
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user => {
      return (
        (user.Name && user.Name.toLowerCase().includes(searchTerm)) ||
        (user['RegistrationNumber'] && user['RegistrationNumber'].toLowerCase().includes(searchTerm))
      );
    });
  }
  
  displayUsers(filteredUsers);
}

// Show/hide loading indicator
function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove('hidden');
    noDataMessage.classList.add('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Show/hide no data message
function showNoData(show) {
  if (show) {
    noDataMessage.classList.remove('hidden');
  } else {
    noDataMessage.classList.add('hidden');
  }
}

// Event listeners
searchInput.addEventListener('input', filterUsers);
filterSelect.addEventListener('change', filterUsers);

// Initial load
// Note: This will be called after authentication in auth.js
