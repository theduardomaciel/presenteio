import { NextResponse } from "next/server";

export async function GET() {
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

	const options = {
		redirect_uri: "http://localhost:3000/api/oauth/callback",
		client_id: process.env.GOOGLE_CLIENT_ID!,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: "https://www.googleapis.com/auth/gmail.send",
	};

	const qs = new URLSearchParams(options);

	return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}
