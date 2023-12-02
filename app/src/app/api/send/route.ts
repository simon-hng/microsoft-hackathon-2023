import { env } from "@/env.mjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Waitlist from "@email/emails/waitlist";

export async function POST() {
  const resend = new Resend(env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "simon.huang@outlook.de",
      subject: "hello world",
      text: "hello world",
      react: Waitlist({
        name: "asd",
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
