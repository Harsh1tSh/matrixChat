import React from "react";

interface Message {
  roomId: string;
  content: string;
  sender: string;
  timestamp: number;
}

interface Props {
  messages: Message[];
}

export default function MessageSummary({ messages }: Props) {
  const totalMessages = messages.length;
  const uniqueSenders = new Set(messages.map((m) => m.sender)).size;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Message Summary</h2>
      <p>Total messages: {totalMessages}</p>
      <p>Unique senders: {uniqueSenders}</p>
    </div>
  );
}
