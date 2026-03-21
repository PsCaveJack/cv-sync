chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "OPEN_POPUP") {
    chrome.action.openPopup().catch(() => {});
  }
});
