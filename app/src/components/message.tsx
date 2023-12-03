import { Avatar } from "@/components/ui/avatar";
import { Robot, User } from "@phosphor-icons/react";
import { Message } from "ai";
import { MemoizedReactMarkdown } from "./markdown";
import { CodeBlock } from "@/components/ui/codeblock";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { SourceList } from "./source-list";
import { LinkPreview } from "./link-preview";

interface ChatMessageProps {
  message: Message;
  showSources?: boolean;
}

export const ChatMessage = ({ message, showSources }: ChatMessageProps) => {
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

interface MessageContentProps {
  content: string;
}
export const MessageContent = ({ content }: MessageContentProps) => (
  <MemoizedReactMarkdown
    className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
    remarkPlugins={[remarkGfm, remarkMath]}
    components={{
      p({ children }) {
        return <p className="mb-2 last:mb-0">{children}</p>;
      },
      a({ href }) {
        return <LinkPreview href={href ?? "#"} title={href} />;
      },
      code({ node, inline, className, children, ...props }) {
        if (children.length) {
          if (children[0] == "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>;
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
    {content}
  </MemoizedReactMarkdown>
);

const BotMessage = ({ message, showSources }: ChatMessageProps) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar className="items-center justify-center bg-primary text-primary-foreground">
        <Robot className="h-6 w-6" />
      </Avatar>
      <div className="rounded-lg bg-gray-200 p-3 dark:bg-gray-800">
        <p className="text-gray-900 dark:text-gray-100">
          <MessageContent content={message.content} />
        </p>
        {showSources && <SourceList />}
      </div>
    </div>
  );
};

const UserMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto">
      <div className="flex items-end justify-end space-x-2">
        <div className="rounded-lg bg-blue-500 p-3 text-white">
          <p className="text-sm">
            <MessageContent content={message.content} />
          </p>
        </div>
        <Avatar className="items-center justify-center bg-blue-500 text-white">
          <User className="h-6 w-6" />
        </Avatar>
      </div>
    </div>
  );
};
