"use client"
import { EmailLog } from "@/lib/types/logs";
import { Card, Title, Text, Badge } from "@tremor/react";
import { Separator } from "@/components/ui/separator";
import { Envelope, Robot } from "@phosphor-icons/react";
import { MessageContent } from "@/components/message";

interface EmailsListProps {
  logs: EmailLog[];
}
export const EmailsList = ({ logs }: EmailsListProps) => {
  return (
    <div>
      {logs.map((log, index) => (
        <Card key={`${index}-${log.subject}`}>
          <div className="flex justify-between mb-8">
            <div>
              <Title>
                {log.subject}
              </Title>
              <Text>
                <a href={`mailto:${log.email}`} className="font-semibold">
                  {log.email}
                </a>
              </Text>
            </div>

            <div>
              <Badge icon={log.status === "answered" ? Robot : Envelope} color={log.status === "answered" ? "green" : "red"}>
                {log.status}
              </Badge>
            </div>
          </div>

          <Text className="mb-2">Question</Text>
          <MessageContent content={log.question} className="bg-gray-100 p-4" />

          {log.status == "answered" &&
          <>
            <Separator className="my-4" />
            <Text className="mb-2">Answer</Text>
            <MessageContent content={log.answer} className="bg-gray-100 p-4" />
          </>
          }
        </Card>
      ))}
    </div>
  );
};
