import { type Message } from "ai";
import { ChatMessage } from "./message";
import { CircleNotch } from "@phosphor-icons/react";

export interface ChatList {
  messages: Message[];
  isLoading: boolean;
}

export function ChatList({ messages, isLoading }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-3 px-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} showSources={!isLoading} />
      ))}
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <CircleNotch className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
