const KEY = 'cv_sync_conversation_id';

export function getConversationId(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get(KEY, (result) => resolve((result[KEY] as string | undefined) ?? ""));
  });
}

export function setConversationId(id: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [KEY]: id }, resolve);
  });
}

export function clearConversationId(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(KEY, resolve);
  });
}
