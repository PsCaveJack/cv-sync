import { useState } from 'react'
import './App.css'
import { analyzeJobDescription } from './lib/openai'
import AnalysisResult from './components/AnalysisResult'
import ResumeUpload from './components/ResumeUpload'

function App() {
  const [analysis, setAnalysis] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");

  const requestJobData = async () => {
    console.log("button pressed")
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("tab info", tab.id)

    if (tab?.id) {
      chrome.tabs.sendMessage(
        tab.id,
        { action: "GET_JOB_TEXT" },
        async (response) => {
          if (chrome.runtime.lastError) {
            console.error("Failed:", chrome.runtime.lastError.message);
            return;
          }
          console.log("Received from Indeed:", response);

          if (response?.description) {
            try {
              const result = await analyzeJobDescription(response.description, resumeText || undefined);
              setAnalysis(result);
            } catch (error) {
              console.error("OpenAI Error:", error);
              setAnalysis("Failed to reach OpenAI.");
            }
          }
        }
      );
    }
  };

  return (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold mb-4">Analyzer</h1>
      <ResumeUpload resumeText={resumeText} onResumeLoaded={setResumeText} />
      <button
        onClick={requestJobData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-3"
      >
        Extract Job Info
      </button>
      <AnalysisResult analysis={analysis} />
    </div>
  )
}

export default App
