import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import InjectableTipsButton from '../components/InjectableTipsButton';

//  Need to identify elements on certain linkedIn pages by data-testid or aria-label
//   classes given to elements are hashed on certain pages
const PLATFORMS = {
  indeed: {
    applyContainers: ['#jobsearch-ViewJobButtons-container'],
    descriptions: ['#jobDescriptionText'],
    navParam: 'vjk',
  },
  linkedin: {
    applyContainers: [
      '.job-details-jobs-unified-top-card__container--two-pane',
    ],
    descriptions: ['#job-details', '[data-testid="expandable-text-box"]'],
    navParam: 'currentJobId',
  },
} as const;

type Platform = keyof typeof PLATFORMS;

function detectPlatform(): Platform | null {
  if (location.hostname.includes('indeed.com')) return 'indeed';
  if (location.hostname.includes('linkedin.com')) return 'linkedin';
  return null;
}

const platform = detectPlatform();
const config = platform ? PLATFORMS[platform] : null;

function injectResumeTipsButton(container: Element) {
  if (!config || document.getElementById('cv-sync-tips-btn')) return;

  const root = document.createElement('div');
  root.id = 'cv-sync-tips-btn';
  container.insertAdjacentElement('afterend', root);
  const descriptionSelector = config.descriptions.find(s => document.querySelector(s)) ?? config.descriptions[0];
  createRoot(root).render(createElement(InjectableTipsButton, { descriptionSelector }));
}

function notifyJobDetected(container: Element) {
  injectResumeTipsButton(container);
}

let domObserver: MutationObserver | null = null;

function cleanup() {
  document.getElementById('cv-sync-tips-btn')?.remove();
  domObserver?.disconnect();
  domObserver = null;
}

function findApplyContainer(): Element | null {
  if (!config) return null;
  for (const selector of config.applyContainers) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  // Finding the apply button must be reached via the aria-label field
  //  this field value is one of two fixed values
  if (platform === 'linkedin') {
    const applyLink = document.querySelector(
      'a[aria-label="Apply on company website"], a[aria-label="Easy Apply to this job"]'
    );
    //  Crawl up the element chain to find a proper container to inject
    if (applyLink?.parentElement?.parentElement?.parentElement?.parentElement) 
      return applyLink.parentElement.parentElement.parentElement.parentElement;
  }
  return null;
}

function watchForJobPage() {
  if (!config) return;

  const existing = findApplyContainer();
  if (existing) {
    notifyJobDetected(existing);
    return;
  }

  domObserver = new MutationObserver(() => {
    const el = findApplyContainer();
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

// Poll for job ID param changes — Indeed uses 'vjk', LinkedIn uses 'currentJobId'
if (config) {
  let lastJobId = new URLSearchParams(location.search).get(config.navParam);
  setInterval(() => {
    const jobId = new URLSearchParams(location.search).get(config.navParam);
    if (jobId !== lastJobId) {
      lastJobId = jobId;
      handleNavigation();
    }
  }, 500);
}

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