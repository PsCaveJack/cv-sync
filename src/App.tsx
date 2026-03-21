import { useState } from 'react'
import './App.css'
import { analyzeJobDescription, getResumeTips } from './lib/openai'
import AnalysisResult from './components/AnalysisResult'
import ResumeUpload from './components/ResumeUpload'

const CONVERSATION_ID_KEY = 'cv_sync_conversation_id';

function App() {
  const [analysis, setAnalysis] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>(
    () => localStorage.getItem(CONVERSATION_ID_KEY) ?? ""
  );

  const getJobDescription = (): Promise<string | null> =>
    new Promise(async (resolve) => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return resolve(null);
      chrome.tabs.sendMessage(tab.id, { action: "GET_JOB_TEXT" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Failed:", chrome.runtime.lastError.message);
          return resolve(null);
        }
        resolve(response?.description ?? null);
      });
    });

  const requestJobData = async () => {
    const description = await getJobDescription();
    if (!description) return;
    try {
      const result = await analyzeJobDescription(description);
      setAnalysis(result);
    } catch (error) {
      console.error("OpenAI Error:", error);
      setAnalysis("Failed to reach OpenAI.");
    }
  };

  const requestResumeTips = async () => {
    if (!conversationId) return;
    const description = await getJobDescription();
    if (!description) return;
    try {
      const { id, text } = await getResumeTips(conversationId, description);
      setConversationId(id);
      localStorage.setItem(CONVERSATION_ID_KEY, id);
      setAnalysis(text);
    } catch (error) {
      console.error("Resume tips error:", error);
      setAnalysis("Failed to get resume tips.");
    }
  };

  return (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold mb-4">Analyzer</h1>
      <ResumeUpload onConversationStarted={setConversationId} />
      <button
        onClick={requestJobData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-3"
      >
        Extract Job Info
      </button>
      {conversationId && (
        <button
          onClick={requestResumeTips}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-2"
        >
          Get Resume Tips
        </button>
      )}
      <AnalysisResult analysis={analysis} />
    </div>
  )
}

export default App
