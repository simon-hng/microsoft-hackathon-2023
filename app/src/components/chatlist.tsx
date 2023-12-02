import { type Message } from "ai";
import { ChatMessage } from "./message";

export interface ChatList {
  messages: Message[];
  isLoading: boolean;
}

export function ChatList({ messages, isLoading }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 flex gap-3 flex-col w-full">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} showSources={!isLoading} />
      ))}
    </div>
  );
}
