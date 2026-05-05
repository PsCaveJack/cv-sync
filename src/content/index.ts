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
    descriptions: ['[data-testid="expandable-text-box"]', '#job-details'],
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
  root.style.cssText = 'position:relative;z-index:9999;pointer-events:auto;';
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
