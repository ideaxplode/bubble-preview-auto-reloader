// Save the user's preference
function saveOptions() {
  const reloadOnFocus = document.getElementById('reloadOnFocus').checked;
  chrome.storage.sync.set({ reloadOnFocus }, () => {
    console.log('Settings saved:', { reloadOnFocus });
    showFlashMessage();
  });
}

// Restore the user's preference
function restoreOptions() {
  chrome.storage.sync.get({ reloadOnFocus: false }, (items) => {
    document.getElementById('reloadOnFocus').checked = items.reloadOnFocus;
  });
}

// Show a brief "Settings saved" message
function showFlashMessage() {
  const flashMessage = document.getElementById('flashMessage');
  flashMessage.style.display = 'block';
  setTimeout(() => {
    flashMessage.style.display = 'none';
  }, 5000); // Hide after 3 seconds
}

// Add event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('reloadOnFocus').addEventListener('change', saveOptions);
