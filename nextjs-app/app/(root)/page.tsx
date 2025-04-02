'use client';

import InputChat from '@/components/root/input-chat';
import MessChat from '@/components/root/mess-chat';
import ShowChat from '@/components/root/show-chat';
import { useState } from 'react';

export default function Home() {
  const [mess, setMess] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  console.log('🚀 ~ Home ~ result:', result);
  return (
    <main className="py-10">
      <ShowChat>
        {mess &&
          mess.map((item, index) => {
            return (
              <>
                <MessChat key={index} result={item} role="user" />
                {!result[index] ? (
                  'Đang trả lời :>'
                ) : (
                  <MessChat
                    key={index + 1000}
                    result={result[index]}
                    role="bot"
                  />
                )}
              </>
            );
          })}
      </ShowChat>
      <InputChat setResult={setResult} setMess={setMess} />
    </main>
  );
}
