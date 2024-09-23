// Listener for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Send a message to the active tab
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    // Check if the tab's URL matches the target pattern
    if (tab.url && tab.url.match(/^https:\/\/.*\.bubbleapps\.io\/.*/)) {
      chrome.tabs.sendMessage(tab.id, { action: 'tabActivated' });
    }
  });
});

// Listener for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused (e.g., minimized or application focus lost)
    return;
  }

  // Get the active tab in the focused window
  chrome.windows.get(windowId, { populate: true }, (window) => {
    if (chrome.runtime.lastError || !window) {
      console.error(chrome.runtime.lastError || 'Window not found');
      return;
    }

    const activeTab = window.tabs.find((tab) => tab.active);
    if (activeTab && activeTab.url && activeTab.url.match(/^https:\/\/.*\.bubbleapps\.io\/.*/)) {
      // Send a message to the active tab
      chrome.tabs.sendMessage(activeTab.id, { action: 'tabActivated' });
    }
  });
});
