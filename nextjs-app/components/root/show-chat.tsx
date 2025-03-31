import React from 'react';
import { ScrollArea } from '../ui/scroll-area';

const ShowChat = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollArea className="container mx-auto h-[70vh] bg-cyan-50 rounded-md border-foreground border-2">
        {children}
      </ScrollArea>
    </>
  );
};

export default ShowChat;
