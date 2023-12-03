import { UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";

const exampleMessages = [
  {
    heading: "How can I track my credits?",
    message: `How can I track my credits?`,
  },
  {
    heading: "Can I work at Microsoft if I graduate from TUM?",
    message: "Can I work at Microsoft if I graduate from TUM?",
  },
  {
    heading: "Why is Azure the best cloud? Academically-speaking",
    message: "Why is Azure the best cloud? Academically-speaking",
  },
];

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to TUM AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <ArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
