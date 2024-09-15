import React from "react";
import { format } from "date-fns";

interface Message {
  roomId: string;
  content: string;
  sender: string;
  timestamp: number;
}

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
      <ul className="space-y-4">
        {messages.map((message, index) => (
          <li key={index} className="border-b pb-2">
            <p className="font-semibold">{message.sender}</p>
            <p>{message.content}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(message.timestamp), "PPpp")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
