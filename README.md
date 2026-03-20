# CV Sync Alpha

This application is currently capable of reading Indeed job postings and communicating with OpenAI via their API. Setting up the project was a bit more difficult than expected, but it's stable now.

Unfortunately, I was not able to have finish a feature-complete alpha by my deadline (2-15-2026),  but I've made significant progress since the start of my sprint.

## Completed Tickets
- Create Basic Extension Project
- Grab Indeed Descriptions from Posts
- Connect to OpenAI's API Platform

## Incomplete Tickets
- Resume Submission (PDF)
- Basic AI Analysis for Resume

## Tech Stack
- **Frontend**: React 18, Tailwind CSS
- **Build Tool**: Vite + CRXJS
- **Language**: TypeScript
- **AI**: OpenAI GPT-4o
- **Research Focus**: Software measurement tool identification.

## Instructions to Install and Run the Browser Extension

### 1. Extract the Project from the ZIP folder

### 2. Build the Extension
- Open the terminal and navigate to the project 

- Run the following command to install the necessary dependencies: `npm install`

- Once installation is complete, run the build command: `npm run dev`

- Result: A new folder named dist/ will appear in your project directory. This folder contains the final, compiled extension. This will be running the extension on a local server and adapts to any changes made by the developer (no relaunches required).

### 3. Load the Extension into Google Chrome
- Open the Google Chrome browser

- Go to chrome://extensions/

- In the top-right corner, toggle the Developer mode to ON

- Click the "Load unpacked" button

- In the file selection dialog, navigate to your project folder and select the dist folder

### 4. OpenAI API Key
- For the sake of simplicity, I've included the env file with a restricted OpenAI key

### 5. Run the Application
- Navigate to Indeed.com.

- Search for a job and click on a posting so the details are displayed in the side panel

- Open CV Sync from the "Extensions" button in the top right

- Click "Extract Job Info"

- Result: The extension will scrape the data and provide an AI-generated summary of technical requirements.

Note: This result isn't clean, but my goal this week was to get as many features in the process going. I'll be dedicating future tasks in next week's sprint to restructuring and cleaning up this code.