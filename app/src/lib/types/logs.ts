export type EmailLog = {
  question: string;
  email: string;
  timestamp: number;
} & (
  | {
      status: "answered";
      answer: string;
    }
  | {
      status: "forwarded";
    }
);
