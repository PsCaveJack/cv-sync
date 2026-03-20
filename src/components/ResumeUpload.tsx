import { useRef } from 'react';
import { extractTextFromPDF } from '../lib/pdf';

interface ResumeUploadProps {
  resumeText: string;
  onResumeLoaded: (text: string) => void;
}

export default function ResumeUpload({ resumeText, onResumeLoaded }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    try {
      const text = await extractTextFromPDF(file);
      onResumeLoaded(text);
    } catch (err) {
      console.error("PDF parse error:", err);
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
        className="w-full px-4 py-2 rounded border border-blue-600 text-blue-600 text-sm hover:bg-blue-50"
      >
        {resumeText ? 'Resume loaded ✓' : 'Upload Resume (PDF)'}
      </button>
    </div>
  );
}
