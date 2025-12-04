import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { to, subject, message } = await req.json();

	try {
		const oauth2 = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			"http://localhost:3000/api/oauth/callback",
		);

		oauth2.setCredentials({
			refresh_token: process.env.GMAIL_REFRESH_TOKEN,
		});

		const gmail = google.gmail({ version: "v1", auth: oauth2 });

		const rawMessage =
			"From: " +
			process.env.GMAIL_ADDRESS +
			"\r\n" +
			"To: " +
			to +
			"\r\n" +
			"Subject: " +
			subject +
			"\r\n\r\n" +
			message;

		const encodedMessage = Buffer.from(rawMessage)
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		await gmail.users.messages.send({
			userId: "me",
			requestBody: { raw: encodedMessage },
		});

		return NextResponse.json({ ok: true });
	} catch (e: any) {
		console.log(e);
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
