"use client";
import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageSummary from "./MessageSummary";
import AIAssistant from "./AIAssistant";
import MessageInput from "./MessageInput";

interface Message {
  roomId: string;
  content: string;
  sender: string;
  timestamp: number;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched messages:", data.messages);
      setMessages(data.messages);
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages. Please try again later.");
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      console.log("Sending message:", content);
      const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.error}`
        );
      }
      console.log("Message sent successfully");
      await fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
      setError(`Failed to send message: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Communication Hub</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <MessageList messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
        <div>
          <MessageSummary messages={messages} />
          <AIAssistant messages={messages} />
        </div>
      </div>
    </div>
  );
}
