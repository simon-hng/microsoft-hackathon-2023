import { Avatar } from "@/components/ui/avatar";
import { Robot, User } from "@phosphor-icons/react";
import { Message } from "ai";
import { MemoizedReactMarkdown } from "./markdown";
import { CodeBlock } from "@/components/ui/codeblock";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

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
}

const BotMessage = ({ message }: MessageBubbleProps) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar className="bg-primary text-primary-foreground items-center justify-center">
        <Robot className="w-6 h-6" />
      </Avatar>
      <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <MessageContent message={message} />
        </p>
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

export const ChatMessage = ({ message }: MessageBubbleProps) => {
  return (
    <>
      {message.role === "user" ? (
        <UserMessage key={message.id} message={message} />
      ) : (
        <BotMessage key={message.id} message={message} />
      )}
    </>
  );
};
