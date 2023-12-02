import { NextRequest, NextResponse } from "next/server";
import { IncomingMail } from "cloudmailin";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { handleQdrantSearch } from "./rag";
import { emailReplyChain } from "@/lib/langchain/email-repy-chain";

const userName = process.env.CLOUDMAILIN_USERNAME || "cloudmailin";
const apiKey = process.env.CLOUDMAILIN_APIKEY || "apikey";
console.log(`Using ${userName} and ${apiKey}`);

export async function POST(request: NextRequest) {
    try {
        // receiving incoming email from CloudMailin
        const {message} = await request.json();
        console.log(message)
        //const mail: IncomingMail = await request.json();
        // parsing email into a string
        //const parsedEmail = await handleEmail(mail);
        //const vectorDBSearchResult = await handleQdrantSearch(parsedEmail, 3);
        const vectorDBSearchResult = await handleQdrantSearch(message, 3);
        console.log(vectorDBSearchResult)
        const emailAnswerEncoded = await emailReplyChain.invoke({
            email: message,
            vdb_answer_1: vectorDBSearchResult[0].metadata.answer,
            vdb_answer_2: vectorDBSearchResult[1].metadata.answer,
            vdb_answer_3: vectorDBSearchResult[2].metadata.answer,
        });
        var emailAnswer = new TextDecoder().decode(emailAnswerEncoded)
        console.log(`Answer: ${emailAnswer}`);
        const forwardDecisionEncoded = await forwardChain.invoke({
            answer: emailAnswer,
        });
        const forwardDecision = new TextDecoder().decode(forwardDecisionEncoded)
        const forwardDecisionBool = forwardDecision == "true" ? true : false
        console.log(`Forward Decision: ${forwardDecision}`);

        //
        return NextResponse.json(
            {
                email: message,
                vectorDBSearchResult: [vectorDBSearchResult[0].metadata.answer, vectorDBSearchResult[1].metadata.answer, vectorDBSearchResult[2].metadata.answer],
                answer: emailAnswer,
                forwardDecision: forwardDecisionBool,
            },
            {status: 201}
        );
        //return new StreamingTextResponse(emailAnswer);
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

async function handleEmail(mail: IncomingMail) {
  let parsedEmail = `Subject: ${mail.headers.subject}\n
                             Content:${mail.plain}`;

  console.log(`Received email from ${mail.headers.from}\n
                 Subject: ${mail.headers.subject}\n
                 Content:${mail.plain}`);

  return parsedEmail;
}
