export type EmailLog = {
  status: "answered" | "forwarded";
  subject: string;
  question: string;
  email: string;
  timestamp: number;
  answer: string;
};
