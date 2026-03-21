import { getResumeTips } from '../lib/openai';
import { getJobDescription, injectAnalysis } from '../lib/tab';

const CONVERSATION_ID_KEY = 'cv_sync_conversation_id';

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
      localStorage.setItem(CONVERSATION_ID_KEY, id);
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
