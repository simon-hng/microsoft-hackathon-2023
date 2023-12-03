import { NextRequest, NextResponse } from "next/server";
import { IncomingMail } from "cloudmailin";
import { handleQdrantSearch } from "./rag";
import { emailReplyChain, forwardChain } from "@/lib/langchain/email-repy-chain";
import { env } from "@/env.mjs";
import { Resend } from "resend";
import Answer from "@email/emails/answer";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const mail: IncomingMail = await request.json();
        const vectorDBSearchResult = await handleQdrantSearch(`subject: ${mail.headers.subject}\nmessage: ${mail.plain}`, 3);

        console.log(vectorDBSearchResult)
        const emailAnswerEncoded = await emailReplyChain.invoke({
            email: mail.plain ?? "",
            vdb_answer_1: vectorDBSearchResult[0].metadata.answer,
            vdb_answer_2: vectorDBSearchResult[1].metadata.answer,
            vdb_answer_3: vectorDBSearchResult[2].metadata.answer,
        });

        const emailAnswer = new TextDecoder().decode(emailAnswerEncoded)

        console.log(`Answer: ${emailAnswer}`);
        const forwardDecisionEncoded = await forwardChain.invoke({
            answer: emailAnswer,
        });

        const forwardDecision = new TextDecoder().decode(forwardDecisionEncoded)
        const forwardDecisionBool = forwardDecision == "true" ? true : false
        console.log(`Forward Decision: ${forwardDecision}`);

        if(forwardDecisionBool) {
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

        return NextResponse.json(
            {
                email: mail,
                vectorDBSearchResult: [vectorDBSearchResult[0].metadata.answer, vectorDBSearchResult[1].metadata.answer, vectorDBSearchResult[2].metadata.answer],
                answer: emailAnswer,
                forwardDecision: forwardDecisionBool,
            },
            {status: 201}
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: `Error: ${error instanceof (Error) ? error.message : error
                }`
            },
            {status: 500}
        );
    }
}
