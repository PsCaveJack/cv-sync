function preprocessDescription(text: string): string {
  const cleaned = text.replace(/[^\S\n]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  const keywordPattern = /(requirement|qualification|skill|experience|responsibi|you will|what you|we're looking|must have|nice to have)/i;
  const lines = cleaned.split('\n');
  const relevant = lines.filter(
    line => keywordPattern.test(line) || line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line.trim())
  );

  const condensed = relevant.length > 10 ? relevant.join('\n') : cleaned;
  return condensed.slice(0, 1500);
}

const API_BASE = "https://cv-sync-api.vercel.app";

// Uses the Responses API which stores conversation state server-side.
// Returns { id, text } — save the id to continue the conversation.
export async function startConversation(resumeText?: string): Promise<{ id: string; text: string }> {
  const response = await fetch(`${API_BASE}/api/start-conversation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText })
  });

  return response.json();
}

// Continues an existing conversation using the id returned by startConversation or a prior sendFollowUp.
// Returns { id, text } — update your stored id with the new one for the next turn.
export async function sendFollowUp(previousResponseId: string, jobDescription: string): Promise<{ id: string; text: string }> {
  const trimmedText = preprocessDescription(jobDescription)
  
  const response = await fetch(`${API_BASE}/api/follow-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ previousResponseId, trimmedText })
  });

  return response.json();
}

// Uses an existing conversation (with resume context) to get 3 tailored resume tips for the job.
export async function getResumeTips(previousResponseId: string, jobDescription: string): Promise<{ id: string; text: string }> {
  const trimmedText = preprocessDescription(jobDescription)
  
  const response = await fetch(`${API_BASE}/api/get-tips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'same-origin',
    body: JSON.stringify({ previousResponseId, trimmedText })
  });

  return response.json();
}
