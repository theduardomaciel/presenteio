import { EmailPayload } from "./types";

//
// Utility 1: Encode subject with UTF-8
//
export function encodeSubject(subject: string) {
	return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

//
// Utility 2: Create MIME email (HTML)
//
export function createMime(payload: EmailPayload) {
	const subject = encodeSubject(payload.subject);

	const message = [
		`From: ${payload.from}`,
		`To: ${payload.to}`,
		`Subject: ${subject}`,
		"MIME-Version: 1.0",
		'Content-Type: text/html; charset="UTF-8"',
		"",
		payload.html,
	].join("\n");

	return Buffer.from(message)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}
