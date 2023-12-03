"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyReturn } from "@phosphor-icons/react";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { ChatList } from "@/components/chatlist";
import { EmptyScreen } from "@/components/empty-screen";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
  } = useChat({ api: "/api/rag-chat" });

  return (
    <>
      <main className="bg-gray-100 dark:bg-gray-900">
        <div className="flex min-h-screen flex-col p-4 py-28">
          {messages.length ? (
            <>
              <ChatList messages={messages} isLoading={isLoading} />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </>
          ) : (
            <EmptyScreen setInput={setInput} />
          )}
        </div>

        <div className="fixed bottom-0 w-full">
          <form
            className="mx-auto flex max-w-4xl items-center space-x-2 p-8"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit">
              <KeyReturn className="mr-2 h-6 w-6" />
              Send
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
