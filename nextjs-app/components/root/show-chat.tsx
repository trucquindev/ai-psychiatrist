import React from 'react';
import { ScrollArea } from '../ui/scroll-area';

const ShowChat = ({ chat }: { chat: string }) => {
  return (
    <>
      <ScrollArea className="container mx-auto h-[70vh]">{chat}</ScrollArea>
    </>
  );
};

export default ShowChat;
