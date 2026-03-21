// currently geting permission errors after the previous log

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