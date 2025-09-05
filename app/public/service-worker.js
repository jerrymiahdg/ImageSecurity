try {
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.scripting.executeScript({
      files: ["contentScript.js"],
      target: { tabId: activeInfo.tabId },
    });
  });
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
      chrome.scripting.executeScript({
        files: ["contentScript.js"],
        target: { tabId: tab.id },
      });
    }
  });
} catch (e) {
  console.log(e);
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "openPopup") {
    chrome.action.openPopup(); // only works in some MV3 contexts
  }
});
