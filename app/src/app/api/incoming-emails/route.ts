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
    const mail: IncomingMail = await request.json();
    // parsing email into a string
    const vectorDBSearchResult = await handleQdrantSearch(
      `subject: ${mail.headers.subject}\nmessage: ${mail.plain}`,
      5,
    );

    // module stuff
    const moduleAnswer = await moduleCall.invoke({
      email: mail.plain ?? "",
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
      email: `subject: ${mail.headers.subject ?? ""}\nmessage: ${mail.plain ?? ""}`,
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

    const forwardDecision = new TextDecoder().decode(forwardDecisionEncoded);
    const regex = /forwardDecision: ?(true|false)/;
    const emailRegex = /emailToForwardTo: ?"?([a-zA-Z._-]+@tum.de)/;
    const match = regex.exec(forwardDecision);
    const forwardDecisionBool = match ? match[1].toLowerCase() === "true" : false;
    const emailMatch = emailRegex.exec(forwardDecision);
    const emailToForwardTo = emailMatch ? emailMatch[1] : "study@tum.de";
    console.log(`Forward Decision: ${forwardDecision}`);
    console.log(`Forward DecisionBool: ${forwardDecisionBool}, ${emailToForwardTo}`);

    if (!forwardDecisionBool) {
      await resend.emails.send({
        from: "support@utn-ai.de",
        to: mail.envelope.from,
        subject: `re: ${mail.headers.subject}`,
        text: emailAnswer,
        react: Answer({
          name: "Student",
          question: mail.plain ?? "",
          answer: emailAnswer,
        }),
      });
    } else {
      await resend.emails.send({
        from: "support@utn-ai.de",
        to: mail.envelope.from,
        subject: `re: ${mail.headers.subject}`,
        text: emailAnswer,
        react: Answer({
          name: "Student",
          question: mail.plain ?? "",
          answer: "Your email has been forwarded to the following address: " + emailToForwardTo + "\nBest regards,\n TUM SoM Student Support Bot",
        }),
      });
    }

    logEmail(mail, emailAnswer, forwardDecisionBool)

    return NextResponse.json(
      {
        email: `subject: ${mail.headers.subject ?? ""}\nmessage: ${mail.plain ?? ""}`,
        vectorDBSearchResult: [
          vectorDBSearchResult[0].metadata.answer,
          vectorDBSearchResult[1].metadata.answer,
          vectorDBSearchResult[2].metadata.answer,
        ],
        answer: emailAnswer,
        forwardDecision: forwardDecisionBool,
        forwardEmail: emailToForwardTo,
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
