import { useRef, useState } from 'react';
import { extractTextFromPDF } from '../lib/pdf';
import { startConversation } from '../lib/openai';
import { getConversationId, setConversationId } from '../lib/storage';

interface ResumeUploadProps {
  onConversationStarted: (id: string) => void;
}

export default function ResumeUpload({ onConversationStarted }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved'>(() => {
    getConversationId().then((id) => { if (id) setStatus('saved'); });
    return 'idle';
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setStatus('loading');
    try {
      const text = await extractTextFromPDF(file);
      const { id } = await startConversation(text);
      await setConversationId(id);
      onConversationStarted(id);
      setStatus('saved');
    } catch (err) {
      console.error("Resume upload error:", err);
      setStatus('idle');
    }
  };

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === 'loading'}
        className="w-full px-4 py-2 rounded border border-blue-600 text-blue-600 text-sm hover:bg-blue-50 disabled:opacity-50"
      >
        {status === 'loading' ? 'Saving resume...' : status === 'saved' ? 'Resume saved ✓' : 'Upload Resume (PDF)'}
      </button>
    </div>
  );
}
