import { analyzeJobDescription } from '../lib/openai';
import { getJobDescription, injectAnalysis } from '../lib/tab';

export default function JobAnalysisButton() {
  const handleClick = async () => {
    const description = await getJobDescription();
    if (!description) return;
    try {
      const result = await analyzeJobDescription(description);
      injectAnalysis(result);
    } catch (error) {
      console.error("OpenAI Error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-3"
    >
      Extract Job Info
    </button>
  );
}
