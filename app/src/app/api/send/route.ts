import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env.mjs";

export async function POST() {
  const resend = new Resend(env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "simon.huang@outlook.de",
      subject: "hello world",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
