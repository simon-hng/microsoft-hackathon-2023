"use client";

import { Message, useChat } from "ai/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageProps {
  message: Message;
}

const BotMessage = ({ message }: MessageProps) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {message.content}
        </p>
      </div>
    </div>
  );
};

const UserMessage = ({ message }: MessageProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      <div className="flex items-end justify-end space-x-2">
        <div className="p-3 rounded-lg bg-blue-500 text-white">
          <p className="text-sm">{message.content}</p>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 p-4 space-y-">
        <div className="flex gap-2 flex-col p-2">
          {messages.map((m) => (
            <>
              {m.role === "user" ? (
                <UserMessage key={m.id} message={m} />
              ) : (
                <BotMessage key={m.id} message={m} />
              )}
            </>
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
