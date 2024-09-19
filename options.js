// Save the user's preference
function saveOptions() {
    const reloadImmediately = document.getElementById('reloadImmediately').checked;
    chrome.storage.sync.set({ reloadImmediately }, () => {
      console.log('Settings saved:', { reloadImmediately });
    });
  }
  
  // Restore the user's preference
  function restoreOptions() {
    chrome.storage.sync.get({ reloadImmediately: false }, (items) => {
      document.getElementById('reloadImmediately').checked = items.reloadImmediately;
    });
  }
  
  // Add event listeners
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('reloadImmediately').addEventListener('change', saveOptions);
  