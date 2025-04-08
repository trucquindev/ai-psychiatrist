'use server';
import { API_URL } from '@/lib/actions/const';
import { NextRequest } from 'next/server';
interface ChatResponse {
  message: string;
  context?: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ChatAction = async (req: NextRequest): Promise<ChatResponse> => {
  const res = await fetch(`${API_URL}/speech_to_text`, {
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    method: 'GET',
    cache: 'no-store',
  });
  const result = await res.json();
  return result;
};
