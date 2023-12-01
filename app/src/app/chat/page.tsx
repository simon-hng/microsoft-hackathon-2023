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
      <header className="fixed w-full bg-primary text-primary-foreground px-8 py-4 z-10">
        <svg
          width="80"
          height="42"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 73 38"
        >
          <path
            d="M28 0v31h8V0h37v38h-7V7h-8v31h-7V7h-8v31H21V7h-7v31H7V7H0V0h28z"
            fill="currentColor"
          />
        </svg>
      </header>

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
