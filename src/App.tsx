import { useState } from 'react'
import './App.css'
import ResumeUpload from './components/ResumeUpload'
import JobAnalysisButton from './components/JobAnalysisButton'
import ResumeTipsButton from './components/ResumeTipsButton'

const CONVERSATION_ID_KEY = 'cv_sync_conversation_id';

function App() {
  const [conversationId, setConversationId] = useState<string>(
    () => localStorage.getItem(CONVERSATION_ID_KEY) ?? ""
  );

  return (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold mb-4">Analyzer</h1>
      <ResumeUpload onConversationStarted={setConversationId} />
      <JobAnalysisButton />
      {conversationId && (
        <ResumeTipsButton conversationId={conversationId} onNewConversationId={setConversationId} />
      )}
    </div>
  )
}

export default App
