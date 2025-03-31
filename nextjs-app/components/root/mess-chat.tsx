import React from 'react';
import { Card, CardContent } from '../ui/card';
interface MessChatProps {
  result: string;
}
const MessChat = ({ result }: MessChatProps) => {
  return (
    <Card>
      <CardContent>{result}</CardContent>
    </Card>
  );
};

export default MessChat;
