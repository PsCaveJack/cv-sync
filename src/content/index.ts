import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { getResumeTips } from '../lib/openai';
import { getConversationId, setConversationId } from '../lib/storage';
import TipsAccordion from '../components/TipsAccordion';

function injectResumeTipsButton(container: Element) {
  if (document.getElementById('cv-sync-tips-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'cv-sync-tips-btn';
  btn.textContent = 'Get Resume Tips';
  btn.style.cssText = 'margin-top:8px;padding:8px 16px;background:#16a34a;color:#fff;border:none;border-radius:4px;font-size:14px;cursor:pointer;width:100%;';

  btn.addEventListener('click', async () => {
    let conversationId = await getConversationId();
    if (!conversationId) {
      chrome.runtime.sendMessage({ action: "OPEN_POPUP" });
      return;
    }

    const description = (document.querySelector('#jobDescriptionText') as HTMLElement)?.innerText?.trim();
    if (!description) return;

    btn.textContent = 'Analyzing...';
    btn.disabled = true;

    try {
      const { id, text } = await getResumeTips(conversationId, description);
      await setConversationId(id);

      document.getElementById('cv-sync-analysis')?.remove();
      const box = document.createElement('div');
      box.id = 'cv-sync-analysis';
      container.insertAdjacentElement('afterend', box);
      createRoot(box).render(createElement(TipsAccordion, { text }));

      btn.textContent = 'Get Resume Tips';
    } catch (err) {
      console.error('Resume tips error:', err);
      btn.textContent = 'Failed — try again';
    }

    btn.disabled = false;
  });

  container.insertAdjacentElement('afterend', btn);
}

function notifyJobDetected(container: Element) {
  injectResumeTipsButton(container);
}

const TARGET = '#jobsearch-ViewJobButtons-container';
let domObserver: MutationObserver | null = null;

function cleanup() {
  document.getElementById('cv-sync-tips-btn')?.remove();
  document.getElementById('cv-sync-analysis')?.remove();
  domObserver?.disconnect();
  domObserver = null;
}

function watchForJobPage() {
  const existing = document.querySelector(TARGET);
  if (existing) {
    notifyJobDetected(existing);
    return;
  }

  domObserver = new MutationObserver(() => {
    const el = document.querySelector(TARGET);
    if (el) {
      domObserver?.disconnect();
      domObserver = null;
      notifyJobDetected(el);
    }
  });

  domObserver.observe(document.body, { childList: true, subtree: true });
}

function handleNavigation() {
  cleanup();
  watchForJobPage();
}

watchForJobPage();

// Poll for vjk param changes — Indeed updates this on every job navigation
let lastVjk = new URLSearchParams(location.search).get('vjk');
setInterval(() => {
  const vjk = new URLSearchParams(location.search).get('vjk');
  if (vjk !== lastVjk) {
    lastVjk = vjk;
    handleNavigation();
  }
}, 500);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "GET_JOB_TEXT") {
    console.log("job data requested");

    // get description
    const title = document.querySelector('h2.jobTitle')?.textContent?.trim() 
        || document.querySelector('[data-testid="viewJob-title"]')?.textContent?.trim();

    const company = document.querySelector('[data-testid="inlineHeader-companyName"]')?.textContent?.trim();
    
    // The description is usually inside this ID
    const description = (document.querySelector('#jobDescriptionText') as HTMLElement)?.innerText?.trim();
    
    sendResponse({
      title: title || "Title not found",
      company: company || "Company not found",
      description: description || "Description not found. Ensure a job is selected."
    });
  }

  if (request.action === "INJECT_ANALYSIS") {
    const { text } = request;

    document.getElementById('cv-sync-analysis')?.remove();

    const titleEl = document.getElementById('jobsearch-ViewJobButtons-container');

    if (!titleEl) {
      sendResponse({ ok: false });
      return true;
    }

    const box = document.createElement('div');
    box.id = 'cv-sync-analysis';
    box.style.cssText = 'margin:8px;padding:10px 12px;background:#f0f4ff;border-left:3px solid #4f6ef7;border-radius:4px;font-size:13px;white-space:pre-wrap;line-height:1.5;color:#1a1a1a;';
    box.textContent = text;

    titleEl.insertAdjacentElement('afterend', box);
    sendResponse({ ok: true });
  }

  return true;
});