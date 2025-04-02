'use server';
import { API_URL } from '@/lib/actions/const';
interface ChatRequest {
  message: string;
  context?: string;
}
interface ChatResponse {
  user_id: string;
  response: {
    response: string;
    normal: boolean;
  };
}
export const ChatAction = async (req: ChatRequest): Promise<ChatResponse> => {
  const res = await fetch(`${API_URL}/chat`, {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      message: req.message,
      context: req.context,
    }),
    cache: 'no-store',
  });
  const result = await res.json();
  console.log('🚀 ~ ChatAction ~ result:', result);
  return result;
};
