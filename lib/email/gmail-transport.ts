import { google } from "googleapis";
import { EmailTransport, EmailPayload } from "./types";

export class GmailTransport implements EmailTransport {
	private oauth2;

	constructor() {
		this.oauth2 = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID!,
			process.env.GOOGLE_CLIENT_SECRET!,
			process.env.GOOGLE_REDIRECT_URI!,
		);

		this.oauth2.setCredentials({
			refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
		});
	}

	async send({ from, to, subject, html }: EmailPayload): Promise<void> {
		const gmail = google.gmail({ version: "v1", auth: this.oauth2 });

		const message =
			`From: ${from}\r\n` +
			`To: ${to}\r\n` +
			`Subject: ${subject}\r\n` +
			"Content-Type: text/html; charset=utf-8\r\n\r\n" +
			html;

		const encodedMessage = Buffer.from(message)
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		await gmail.users.messages.send({
			userId: "me",
			requestBody: { raw: encodedMessage },
		});
	}
}
