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

// Uses the Responses API which stores conversation state server-side.
// Returns { id, text } — save the id to continue the conversation.
export async function startConversation(resumeText?: string): Promise<{ id: string; text: string }> {
  const instructions = resumeText
    ? `You are a career coach helping a candidate with job applications. The candidate's resume is below — use it as context for all responses.\n\nRESUME:\n${resumeText.slice(0, 3000)}`
    : "You are a career coach helping a candidate with job applications.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input: "I've shared my resume. I'm ready to discuss job applications."
    })
  });

  const data = await response.json();
  return { id: data.id, text: data.output[0].content[0].text };
}

// Continues an existing conversation using the id returned by startConversation or a prior sendFollowUp.
// Returns { id, text } — update your stored id with the new one for the next turn.
export async function sendFollowUp(previousResponseId: string, message: string): Promise<{ id: string; text: string }> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      model: MODEL,
      previous_response_id: previousResponseId,
      input: message
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
