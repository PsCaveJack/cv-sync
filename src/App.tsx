import { useState } from 'react'
import './App.css'

interface JobPost {
  title: string;
  company: string;
  description: string;
}

function App() {
  const [jobData, setJobData] = useState<JobPost | null>(null);
  const [analysis, setAnalysis] = useState<string>("");

  const AIRequest = async( jobDescription: string | undefined ) => {
    console.log("Sending request", jobDescription)
    if (!jobDescription) {
      return;
    }
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_SECRET_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.2",
          messages: [
            {
              role: "system",
              content: "You are a career coach. Analyze the following job description. Identify the top 3 technical skills required and give a 1-sentence summary of the role."
            },
            {
              role: "user",
              content: jobDescription
            }
          ]
        })
      });

      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error("OpenAI Error:", error);
      setAnalysis("Failed to reach OpenAI.");
    }
  }

  const requestJobData = async () => {
    console.log("button pressed")
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("tab info", tab.id)

    if (tab?.id) {
      chrome.tabs.sendMessage(
        tab.id, 
        { action: "GET_JOB_TEXT" }, 
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Failed:", chrome.runtime.lastError.message);
            return;
          }
          console.log("Received from LinkedIn:", response);
          setJobData(response);
        }
      );
    }

    console.log("Response", jobData)

    AIRequest(jobData?.description)
  };

  return (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold mb-4">Analyzer</h1>
      <button 
        onClick={requestJobData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Extract Job Info
      </button>

      {analysis && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Response:</strong> {analysis}
        </div>
        
      )}
    </div>
  )
}

export default App
