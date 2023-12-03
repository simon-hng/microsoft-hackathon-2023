import { NextRequest, NextResponse } from "next/server";
import { IncomingMail } from "cloudmailin";
import { handleQdrantSearch } from "./rag";
import {
  emailReplyChain,
  forwardChain,
} from "@/lib/langchain/email-repy-chain";
import { env } from "@/env.mjs";
import { Resend } from "resend";
import { kv } from "@vercel/kv";
import Answer from "@email/emails/answer";
import { EmailLog } from "@/lib/types/logs";
import { moduleCall } from "@/lib/langchain/module-handbook";
import * as moduleHandbook from "@/lib/langchain/module_descriptions/desc.json";

const resend = new Resend(env.RESEND_API_KEY);

const logEmail = (email: IncomingMail, answer: string, forwarded: boolean) => {
    let log: Partial<EmailLog> = {
      subject: Array.isArray(email.headers.subject) ? email.headers.subject.at(0) ?? "" : email.headers.subject,
      email: email.envelope.from,
      question: email.plain ?? "",
      answer,
      timestamp: Date.now(),
    };

    if(forwarded) {
      log.status = "forwarded";
    } else {
      log.status = "answered";
      log.answer = answer;
    }

    kv.zadd("email-logs", {
      score: (log as EmailLog).timestamp,
      member: JSON.stringify(log),
    });
}

export async function POST(request: NextRequest) {
  try {
    // receiving incoming email from CloudMailin
    const { message } = await request.json();
    console.log(message);
    const mail: IncomingMail = await request.json();
    // parsing email into a string
    const vectorDBSearchResult = await handleQdrantSearch(
      `subject: ${mail.headers.subject}\nmessage: ${mail.plain}`,
      3,
    );

    // module stuff
    const moduleAnswer = await moduleCall.invoke({
      email: message,
    });
    const mAnswer = new TextDecoder().decode(moduleAnswer);

    let moduleContext = "";

    const mH: { [key: string]: { [key: string]: string } } = moduleHandbook;

    if (mAnswer != "OTHER") {
      // load json

      // get context out of json
      var moduleD = mH[mAnswer];

      moduleContext = `Further context: Relevant module title: ${mAnswer}, Description: ${JSON.stringify(
        moduleD,
      )}`;
    }

    console.log(vectorDBSearchResult);
    const emailAnswerEncoded = await emailReplyChain.invoke({
      email: message,
      vdb_answer_1: vectorDBSearchResult[0].metadata.answer,
      vdb_question_1: vectorDBSearchResult[0].metadata.question,
      vdb_answer_2: vectorDBSearchResult[1].metadata.answer,
      vdb_question_2: vectorDBSearchResult[1].metadata.question,
      vdb_answer_3: vectorDBSearchResult[2].metadata.answer,
      vdb_question_3: vectorDBSearchResult[2].metadata.question,
      // module information
      further_info: moduleContext,
    });

    const emailAnswer = new TextDecoder().decode(emailAnswerEncoded);
    console.log(`Answer: ${emailAnswer}`);
    const forwardDecisionEncoded = await forwardChain.invoke({
      answer: emailAnswer,
    });

    const forwardDecision = new TextDecoder().decode(forwardDecisionEncoded) == "true";
    console.log(`Forward Decision: ${forwardDecision}`);

    if (forwardDecision) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: mail.envelope.from,
        subject: `re: ${mail.headers.subject}`,
        text: emailAnswer,
        react: Answer({
          name: "Student",
          question: mail.plain ?? "",
          answer: emailAnswer,
        }),
      });
    }

    logEmail(mail, emailAnswer, forwardDecision)

    return NextResponse.json(
      {
        email: mail,
        vectorDBSearchResult: [
          vectorDBSearchResult[0].metadata.answer,
          vectorDBSearchResult[1].metadata.answer,
          vectorDBSearchResult[2].metadata.answer,
        ],
        answer: emailAnswer,
        forwardDecision: forwardDecision,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error: ${error instanceof Error ? error.message : error}`,
      },
      { status: 500 },
    );
  }
}
