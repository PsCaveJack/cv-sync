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

const MODEL = "gpt-5.2";

const HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_SECRET_KEY}`
};

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
  const trimmed = preprocessDescription(jobDescription);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      previous_response_id: previousResponseId,
      input: trimmed
    })
  });

  const data = await response.json();
  return { id: data.id, text: data.output[0].content[0].text };
}

// Uses an existing conversation (with resume context) to get 3 tailored resume tips for the job.
export async function getResumeTips(conversationId: string, jobDescription: string): Promise<{ id: string; text: string }> {
  const trimmed = preprocessDescription(jobDescription);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      previous_response_id: conversationId,
      input: `Here is a job description I'm applying to:\n\n${trimmed}\n\nBased on my resume, give me exactly 3 specific tips to tailor my resume for this role.`
    })
  });

  const data = await response.json();
  return { id: data.id, text: data.output[0].content[0].text };
}

function buildSystemPrompt(resumeText?: string): string {
  const base = "You are a career coach. Analyze the following job description. Identify the top 3 technical skills required and give a 1-sentence summary of the role.";
  if (!resumeText) return base;
  return `${base}\n\nThe candidate's resume is provided below for reference. Use it to personalize your advice and highlight gaps or strengths relative to the job.\n\nRESUME:\n${resumeText.slice(0, 3000)}`;
}

export async function analyzeJobDescription(jobDescription: string, resumeText?: string): Promise<string> {
  const trimmed = preprocessDescription(jobDescription);
  console.log("Sending request", trimmed);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(resumeText) },
        { role: "user", content: trimmed }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
