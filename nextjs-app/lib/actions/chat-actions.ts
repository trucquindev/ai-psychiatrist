interface ChatRequest {
  prompt: string;
  context?: string;
}
interface ChatResponse {
  result: string;
}
export const ChatActions = async (req: ChatRequest): Promise<ChatResponse> => {
  const res = await fetch('http//', {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      prompt: req.prompt,
      context: req.context,
    }),
  });
  const result = await res.json();
  return result;
};
