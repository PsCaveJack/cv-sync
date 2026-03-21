export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

export function getJobDescription(): Promise<string | null> {
  return new Promise(async (resolve) => {
    const tab = await getActiveTab();
    if (!tab?.id) return resolve(null);
    chrome.tabs.sendMessage(tab.id, { action: "GET_JOB_TEXT" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Failed:", chrome.runtime.lastError.message);
        return resolve(null);
      }
      resolve(response?.description ?? null);
    });
  });
}

export async function injectAnalysis(text: string): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { action: "INJECT_ANALYSIS", text });
}
