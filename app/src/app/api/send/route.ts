import { env } from "@/env.mjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Answer from "@email/emails/answer";

export async function POST() {
  const resend = new Resend(env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "support@utn-ai.de",
      to: "simon.huang@tum.de",
      subject: `re: subject`,
      text: "answer",
      react: Answer({
        name: "Student",
        question: "question",
        answer: "answer",
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
