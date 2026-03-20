interface AnalysisResultProps {
  analysis: string;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  if (!analysis) return null;

  return (
    <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
      <strong>Response:</strong> {analysis}
    </div>
  );
}
