import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "ai";

interface MessageBubbleProps {
  message: Message;
}

const BotMessage = ({ message }: MessageBubbleProps) => {
  return (
    <div className="flex items-end space-x-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {message.content}
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
          <p className="text-sm">{message.content}</p>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
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
