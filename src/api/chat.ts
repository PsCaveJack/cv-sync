//  TODO: Migrate OpenAI requests to a separate vercel server
const PROXY_URL = "https://your-proxy-app.vercel.app/api/chat";

export async function askQuestion(query: string, conversationId?: string) {
  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      conversation_id: conversationId,
      // You don't send the API key here!
    }),
  });

  return await response.json();
}