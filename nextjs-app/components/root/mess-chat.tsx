import React from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
interface MessChatProps {
  result: string;
  role: 'user' | 'bot';
}
const MessChat = ({ result, role }: MessChatProps) => {
  const varianStyle = {
    user: 'ml-auto',
    bot: 'mr-auto',
  };
  return (
    <Card
      className={`my-3 w-fit mx-2 max-w-[60rem] ${
        role === 'user' ? varianStyle.user : varianStyle.bot
      }`}
    >
      <CardTitle className='p-3'>{role === 'user' ? 'User' : 'Bot'}</CardTitle>
      <CardContent>{result}</CardContent>
    </Card>
  );
};

export default MessChat;
