// Token clearing utility - Run this in browser console if you're having auth issues
// Copy and paste this entire script into your browser's developer console

(function() {
  console.log('🧹 Clearing all authentication tokens...');
  
  // Clear all possible token-related items
  const itemsToRemove = [
    'access_token',
    'refresh_token',
    'user',
    'isAuthenticated',
    'auth_token',
    'jwt_token',
    'token'
  ];
  
  // Remove specific items
  itemsToRemove.forEach(item => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item);
      console.log(`✅ Removed: ${item}`);
    }
  });
  
  // Remove any other items that might contain 'token' or 'auth'
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')) {
      localStorage.removeItem(key);
      console.log(`✅ Removed: ${key}`);
    }
  });
  
  // Clear sessionStorage as well
  sessionStorage.clear();
  console.log('✅ Cleared sessionStorage');
  
  console.log('🎉 All tokens cleared! Refreshing page...');
  
  // Refresh the page to ensure clean state
  setTimeout(() => {
    window.location.reload();
  }, 1000);
})();
