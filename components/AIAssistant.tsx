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

export default function AIAssistant({ messages }: Props) {
  // This is a placeholder for AI-generated content
  const aiSuggestion =
    messages.length > 0
      ? `Based on recent messages, you might want to follow up with ${messages[0].sender} about their last message.`
      : "No recent messages to analyze.";

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      <p>{aiSuggestion}</p>
    </div>
  );
}
