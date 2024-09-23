// Variables to track state
let reloadTimeout = null;
let reloadImmediately = false;
let updateDetected = false;
let titleModified = false;

// Debounce mechanism to prevent multiple reloads
const reloadCooldown = 1000; // milliseconds
let lastReloadTime = 0;

// Function to reload the page safely with debounce
function safeReload() {
  const now = Date.now();
  if (now - lastReloadTime < reloadCooldown) {
    console.log('Skipping reload to prevent multiple reloads.');
    return;
  }
  lastReloadTime = now;

  if (!reloadTimeout) {
    console.log('Reloading page due to detected update notification.');
    location.reload();
    // Set a timeout to prevent immediate subsequent reloads
    reloadTimeout = setTimeout(() => {
      reloadTimeout = null;
    }, 5000); // Adjust the timeout as needed (in milliseconds)
  }
}

// Function to check if the last child of body is the target element with exact content
function checkLastChild() {
  const lastChild = document.body.lastElementChild;
  if (lastChild && lastChild.matches('div.bad-revision')) {
    const contentToMatch = 'We just updated this page.  Please refresh the page to get the latest version. You will not be able to use the app until you refresh.';
    const textContent = lastChild.textContent;
    if (textContent === contentToMatch) {
      // Update detected
      // Modify the page title to indicate pending update
      if (!titleModified) {
        document.title = '* ' + document.title;
        titleModified = true;
      }

      if (reloadImmediately) {
        // Reload immediately
        safeReload();
      } else {
        // Set flag to reload when tab becomes active or window gains focus
        updateDetected = true;
        console.log('Update detected. Will reload when tab becomes active or window gains focus.');
      }
      return true;
    }
  }
  return false;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'tabActivated' && updateDetected) {
    console.log('Tab activated or window focused. Reloading due to previous update detection.');
    safeReload();
    updateDetected = false;
    // Title will reset after reload, but reset variables just in case
    titleModified = false;
  }
});

// Function to get the user's preference from storage
function getUserPreference(callback) {
  chrome.storage.sync.get({ reloadImmediately: false }, (items) => {
    reloadImmediately = items.reloadImmediately;
    callback();
  });
}

// Initialize the script
getUserPreference(() => {
  // Create a MutationObserver to watch for added nodes to <body>
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if the last child is the target element with specific content
        if (checkLastChild()) {
          // Stop observing to prevent further triggers
          observer.disconnect();
          break;
        }
      }
    }
  });

  // Start observing the <body> element for added child nodes
  observer.observe(document.body, {
    childList: true, // Monitor direct children of <body>
    subtree: false   // Do not monitor the entire subtree
  });

  // Initial check in case the element is already present
  if (checkLastChild()) {
    observer.disconnect();
  }
});
