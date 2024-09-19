chrome.tabs.onActivated.addListener((activeInfo) => {
    // Send a message to the active tab
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      // Check if the tab's URL matches the target pattern
      if (tab.url && tab.url.match(/^https:\/\/.*\.bubbleapps\.io\/.*/)) {
        chrome.tabs.sendMessage(tab.id, { action: 'tabActivated' });
      }
    });
  });
  