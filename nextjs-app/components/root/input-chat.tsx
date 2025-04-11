/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { ChatAction } from '@/lib/actions/chat-actions';
import MicPopup from './input-mic';

interface InputChatProps {
  setMess: (e: any) => void;
  setResult: (e: any) => void;
}
const InputChat = ({ setMess, setResult }: InputChatProps) => {
  const [value, setValue] = React.useState<string>('');
  console.log('🚀 ~ InputChat ~ value:', value);
  const handleSubmit = () => {
    ChatAction({ message: value }).then((response) => {
      setResult((prev: string[]) => {
        return [...prev, response.response.response];
      });
    });
  };
  return (
    <section className="flex gap-2 container mx-auto my-3">
      <Input
        type="text"
        minLength={4}
        maxLength={1000}
        className=""
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="Type your message here..."
      />
      <div className="flex items-center justify-center">
        <MicPopup setValue={setValue} />
      </div>
      <Button
        onClick={() => {
          if (value.length < 4) {
            alert('Message must be at least 10 characters long');
            return;
          }
          if (value.length > 1000) {
            alert('Message must be less than 1000 characters long');
            return;
          }
          setMess((prev: string[]) => {
            return [...prev, value];
          });
          handleSubmit();
          setValue('');
        }}
      >
        <Send />
      </Button>
    </section>
  );
};

export default InputChat;
