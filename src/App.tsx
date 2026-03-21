import { useState, useEffect } from 'react'
import './App.css'
import ResumeUpload from './components/ResumeUpload'
import JobAnalysisButton from './components/JobAnalysisButton'
import ResumeTipsButton from './components/ResumeTipsButton'
import { getConversationId } from './lib/storage'

function App() {
  const [conversationId, setConversationId] = useState<string>("");

  useEffect(() => {
    getConversationId().then(setConversationId);
  }, []);

  return (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold mb-4">CV-Sync</h1>
      <ResumeUpload onConversationStarted={setConversationId} />
      <JobAnalysisButton />
      {conversationId && (
        <ResumeTipsButton conversationId={conversationId} onNewConversationId={setConversationId} />
      )}
    </div>
  )
}

export default App
