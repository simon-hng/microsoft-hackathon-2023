"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/message";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="bg-gray-100 dark:bg-gray-900">
      <div className="min-h-screen flex flex-col p-4">
        <div className="flex gap-2 flex-col p-2">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 w-full">
        <form
          className="items-center space-x-2 w-full flex p-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </main>
  );
}
