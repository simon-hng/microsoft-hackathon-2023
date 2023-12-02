import {NextRequest, NextResponse} from "next/server";
import {IncomingMail} from "cloudmailin";
import {handleQdrantSearch} from "./rag"


const userName = process.env.CLOUDMAILIN_USERNAME || "cloudmailin";
const apiKey = process.env.CLOUDMAILIN_APIKEY || "apikey";
console.log(`Using ${userName} and ${apiKey}`);

export async function POST(request: NextRequest) {
    try {
        // receiving incoming email from CloudMailin
        const mail: IncomingMail = await request.json();
        // parsing email into a string
        const parsedEmail = await handleEmail(mail);
        const vectorDBSearchResult = await handleQdrantSearch(parsedEmail, 3);


        //















        return NextResponse.json(
            {
                message: parsedEmail
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

async function handleEmail(mail: IncomingMail) {

    let parsedEmail = `Subject: ${mail.headers.subject}\n
                             Content:${mail.plain}`;

    console.log(`Received email from ${mail.headers.from}\n
                 Subject: ${mail.headers.subject}\n
                 Content:${mail.plain}`);

    return parsedEmail;
}