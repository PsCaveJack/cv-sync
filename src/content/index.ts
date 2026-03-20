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

  return true;
});