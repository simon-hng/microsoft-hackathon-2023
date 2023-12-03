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
        <div className="flex justify-center mt-4">
          <CircleNotch className="animate-spin w-10 h-10 text-primary"/>
        </div>
      )}
    </div>
  );
}
