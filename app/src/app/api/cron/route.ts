import { ImapFlow } from "imapflow";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next/types";

const client = new ImapFlow({
  host: "ethereal.email",
  port: 993,
  secure: true,
  auth: {
    user: "garland.mcclure71@ethereal.email",
    pass: "mW6e4wWWnEd3H4hT5B",
  },
});

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  if (request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).end("Unauthorized");
  }

  // Wait until client connects and authorizes
  await client.connect();

  // Select and lock a mailbox. Throws if mailbox does not exist
  let lock = await client.getMailboxLock("INBOX");
  try {
    // fetch latest message source
    // client.mailbox includes information about currently selected mailbox
    // "exists" value is also the largest sequence number available in the mailbox
    // @ts-ignore
    let message = await client.fetchOne(client.mailbox.exists, {
      source: true,
    });
    console.log(message.source.toString());

    // list subjects for all messages
    // uid value is always included in FETCH response, envelope strings are in unicode.
    for await (let message of client.fetch("1:*", { envelope: true })) {
      console.log(`${message.uid}: ${message.envelope.subject}`);
    }
  } finally {
    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release();
  }

  // log out and close connection
  await client.logout();

  return NextResponse.json({ ok: true });
}
