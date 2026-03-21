import './App.css'
import ResumeUpload from './components/ResumeUpload'

function App() {

  return (
    <div className="p-4 w-64 bg-white shadow-lg rounded-lg">
      <h1 className="text-lg font-bold mb-4">CV-Sync</h1>
      <ResumeUpload />
    </div>
  )
}

export default App
