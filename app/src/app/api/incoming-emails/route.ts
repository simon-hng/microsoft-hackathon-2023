import {NextRequest, NextResponse} from "next/server";
import {IncomingMail} from "cloudmailin";


const userName = process.env.CLOUDMAILIN_USERNAME || "cloudmailin";
const apiKey = process.env.CLOUDMAILIN_APIKEY || "apikey";
console.log(`Using ${userName} and ${apiKey}`);

export async function POST(request: NextRequest) {
    try {
        let mail: IncomingMail = await request.json();

        const parsedEmail = await handleEmail(mail);

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