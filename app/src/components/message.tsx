import { Avatar } from "@/components/ui/avatar";
import { BookOpen, Robot, User } from "@phosphor-icons/react";
import { Message } from "ai";
import { MemoizedReactMarkdown } from "./markdown";
import { CodeBlock } from "@/components/ui/codeblock";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

const MessageContent = ({ message }: MessageBubbleProps) => (
  <MemoizedReactMarkdown
    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
    remarkPlugins={[remarkGfm, remarkMath]}
    components={{
      p({ children }) {
        return <p className="mb-2 last:mb-0">{children}</p>;
      },
      code({ node, inline, className, children, ...props }) {
        if (children.length) {
          if (children[0] == "▍") {
            return <span className="mt-1 cursor-default animate-pulse">▍</span>;
          }

          children[0] = (children[0] as string).replace("`▍`", "▍");
        }

        const match = /language-(\w+)/.exec(className || "");

        if (inline) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }

        return (
          <CodeBlock
            key={Math.random()}
            language={(match && match[1]) || ""}
            value={String(children).replace(/\n$/, "")}
            {...props}
          />
        );
      },
    }}
  >
    {message.content}
  </MemoizedReactMarkdown>
);
interface MessageBubbleProps {
  message: Message;
  showSources?: boolean;
}

const SourceList = () => {
  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-dark-300 text-sm mt-3">
      <BookOpen className="w-6 h-6" />
      <p>
        Sources:{" "}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link href="" className="underline underline-offset-2">
              TUM.de
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade bg-white p-5 data-[state=open]:transition-all">
            <div className="flex justify-between space-x-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  TUM. The Entrepreneurial - Technical University of Munich
                </h4>
                <p className="text-sm">
                  is a leading university for natural sciences and engineering
                  in Germany and the world. Learn about its innovation, talent,
                  excellence and responsibility, and discover its news, research
                  results and upcoming events.
                </p>
                <Link
                  className="flex text-blue-500 underline"
                  target="_blank"
                  href="http://tum.de"
                >
                  Visit Source
                </Link>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </p>
    </div>
  );
};

const BotMessage = ({ message, showSources }: MessageBubbleProps) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar className="bg-primary text-primary-foreground items-center justify-center">
        <Robot className="w-6 h-6" />
      </Avatar>
      <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">
        <p className="text-gray-900 dark:text-gray-100">
          <MessageContent message={message} />
        </p>
        {showSources && <SourceList />}
      </div>
    </div>
  );
};

const UserMessage = ({ message }: MessageBubbleProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      <div className="flex items-end justify-end space-x-2">
        <div className="p-3 rounded-lg bg-blue-500 text-white">
          <p className="text-sm">
            <MessageContent message={message} />
          </p>
        </div>
        <Avatar className="bg-blue-500 text-white items-center justify-center">
          <User className="w-6 h-6" />
        </Avatar>
      </div>
    </div>
  );
};

export const ChatMessage = ({ message, showSources }: MessageBubbleProps) => {
  return (
    <>
      {message.role === "user" ? (
        <UserMessage key={message.id} message={message} />
      ) : (
        <BotMessage
          key={message.id}
          message={message}
          showSources={showSources}
        />
      )}
    </>
  );
};
