'use client';

import InputChat from '@/components/root/input-chat';
import ShowChat from '@/components/root/show-chat';
import { useState } from 'react';

export default function Home() {
  const [mess, setMess] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  console.log('🚀 ~ Home ~ mess:', mess);
  return (
    <main className="py-10">
      <ShowChat>
        <></>
      </ShowChat>
      <InputChat currentMess={mess} setMess={setMess} />
    </main>
  );
}
