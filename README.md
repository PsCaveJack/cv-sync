# CV Sync

## What is CV Sync?

CV Sync is a Chrome extension that analyzes job postings on **Indeed** and **LinkedIn** and gives you 3 personalized tips on how to tailor your resume to fit the role — powered by AI.

---

## Installation

### Option 1 — Chrome Web Store
1. Install CV Sync from the Chrome Web Store.
2. Pin it to your toolbar by clicking the puzzle icon (🧩) in Chrome and pinning CV Sync.

### Option 2 — Manual install from `dist` folder
1. Download or clone this repository and run `npm run build` to generate the `dist/` folder.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the `dist/` folder.
5. Pin CV Sync to your toolbar by clicking the puzzle icon (🧩) and pinning it.

---

## Setting Up Your Resume

Before using CV Sync on a job page, you need to upload your resume once.

1. Click the **CV Sync icon** in your Chrome toolbar to open the popup.
2. Click **Upload Resume (PDF)** and select your resume file.
3. Keep the popup open while it saves — you will see *"Keep this open while your resume is being saved..."*
4. Once saved, the button will change to **Resume saved ✓**.

> Your resume is processed securely and used only to personalize your tips. It is not stored after the session is created.

---

## Getting Resume Tips on a Job Page

### Indeed

1. Go to [indeed.com](https://indeed.com) and open any job listing.
2. A green **Get Resume Tips** button will appear below the Apply button.
3. Click it — CV Sync will analyze the job description against your resume.
4. 3 personalized tips will appear as expandable cards below the button.

### LinkedIn

1. Go to [linkedin.com/jobs](https://linkedin.com/jobs) and open any job listing.
2. A green **Get Resume Tips** button will appear below the top card.
3. Click it — CV Sync will analyze the job description against your resume.
4. 3 personalized tips will appear as expandable cards below the button.

> **Note:** If you navigate to a different job, the button will automatically reappear for the new listing.

---

## Reading Your Tips

Each tip is shown as a collapsible card. Click a card to expand it and read the full suggestion.

Tips are specific to both your resume and the job you are viewing — they will differ between roles.

---

## No Resume Uploaded?

If you click **Get Resume Tips** without a resume uploaded, the extension popup will open automatically so you can upload one.

---

## Removing Your Resume

1. Open the CV Sync popup.
2. Click **Remove Resume**.
3. Your resume context will be cleared. You can upload a new one at any time.

---

## Supported Job Sites

| Site | Supported |
|------|-----------|
| Indeed | ✓ |
| LinkedIn | ✓ |

---

## Troubleshooting

**The "Get Resume Tips" button is not appearing.**
- Make sure you are on a job listing page (not a search results page).
- Try refreshing the page.

**Tips say "Failed — try again."**
- Check your internet connection and click the button again.

**Resume upload is stuck on "Saving resume..."**
- Keep the popup open until it completes. Closing it cancels the upload.