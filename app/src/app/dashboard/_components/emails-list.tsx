"use client"
import { EmailLog } from "@/lib/types/logs";
import { Card, Title, Text, Badge } from "@tremor/react";
import { Separator } from "@/components/ui/separator";
import { Robot } from "@phosphor-icons/react";

interface EmailsListProps {
  logs: EmailLog[];
}
export const EmailsList = ({ logs }: EmailsListProps) => {
  return (
    <div>
      {logs.map((log) => (
        <Card>
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
          <p>{log.question}</p>

          <Separator className="my-4" />

          {log.status == "answered" && <p>{log.answer}</p>}
        </Card>
      ))}
    </div>
  );
};
