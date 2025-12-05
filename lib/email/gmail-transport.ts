import { google } from "googleapis";
import { EmailTransport, EmailPayload } from "./types";
import { createMime } from "./utils";

export class GmailTransport implements EmailTransport {
	private gmail;

	constructor() {
		const auth = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID!,
			process.env.GOOGLE_CLIENT_SECRET!,
			process.env.GOOGLE_REDIRECT_URI!,
		);

		auth.setCredentials({
			refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
		});

		this.gmail = google.gmail({ version: "v1", auth });
	}

	async send(payload: EmailPayload): Promise<void> {
		const raw = createMime(payload);

		await this.gmail.users.messages.send({
			userId: "me",
			requestBody: { raw },
		});
	}
}
