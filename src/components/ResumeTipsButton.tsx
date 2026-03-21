import { getResumeTips } from '../lib/openai';
import { getJobDescription, injectAnalysis } from '../lib/tab';
import { setConversationId } from '../lib/storage';


interface ResumeTipsButtonProps {
  conversationId: string;
  onNewConversationId: (id: string) => void;
}

export default function ResumeTipsButton({ conversationId, onNewConversationId }: ResumeTipsButtonProps) {
  const handleClick = async () => {
    const description = await getJobDescription();
    if (!description) return;
    try {
      const { id, text } = await getResumeTips(conversationId, description);
      await setConversationId(id);
      onNewConversationId(id);
      injectAnalysis(text);
    } catch (error) {
      console.error("Resume tips error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-2"
    >
      Get Resume Tips
    </button>
  );
}
