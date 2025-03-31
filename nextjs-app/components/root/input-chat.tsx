'use client';
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface InputChatProps {
  currentMess: string[];
  setMess: (e: string[]) => void;
}
const InputChat = ({ currentMess, setMess }: InputChatProps) => {
  const [value, setValue] = React.useState<string>('');
  return (
    <section className="flex gap-2 container mx-auto my-3">
      <Input
        type="text"
        minLength={10}
        maxLength={1000}
        className=""
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="Type your message here..."
      />
      <Button
        onClick={() => {
          if (value.length < 10) {
            alert('Message must be at least 10 characters long');
            return;
          }
          if (value.length > 1000) {
            alert('Message must be less than 1000 characters long');
            return;
          }
          setMess([...currentMess, value]);
          setValue('');
        }}
      >
        <Send />
      </Button>
    </section>
  );
};

export default InputChat;
