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

export async function analyzeJobDescription(jobDescription: string): Promise<string> {
  const trimmed = preprocessDescription(jobDescription);
  console.log("Sending request", trimmed);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_SECRET_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: "You are a career coach. Analyze the following job description. Identify the top 3 technical skills required and give a 1-sentence summary of the role."
        },
        {
          role: "user",
          content: trimmed
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
