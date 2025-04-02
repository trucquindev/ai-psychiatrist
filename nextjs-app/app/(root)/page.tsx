'use client';

import InputChat from '@/components/root/input-chat';
import ShowChat from '@/components/root/show-chat';
import { useState } from 'react';

export default function Home() {
  const [mess, setMess] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  console.log('🚀 ~ Home ~ result:', result);
  return (
    <main className="py-10">
      <ShowChat>
        <></>
      </ShowChat>
      <InputChat setResult={setResult} setMess={setMess} />
    </main>
  );
}
