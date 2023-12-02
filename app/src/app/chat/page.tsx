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
  } = useChat();

  return (
    <>
      <main className="bg-gray-100 dark:bg-gray-900">
        <div className="min-h-screen flex flex-col p-4 py-28">
          {messages.length ? (
            <>
              <ChatList messages={messages} />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </>
          ) : (
            <EmptyScreen setInput={setInput} />
          )}
        </div>

        <div className="fixed bottom-0 w-full">
          <form
            className="items-center space-x-2 max-w-4xl flex mx-auto p-8"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit">
              <KeyReturn className="w-6 h-6 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
