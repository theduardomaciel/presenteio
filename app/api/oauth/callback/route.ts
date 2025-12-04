import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const code = url.searchParams.get("code") || "";

	const tokenUrl = "https://oauth2.googleapis.com/token";

	const data = {
		code,
		client_id: process.env.GOOGLE_CLIENT_ID!,
		client_secret: process.env.GOOGLE_CLIENT_SECRET!,
		redirect_uri: "http://localhost:3000/api/oauth/callback",
		grant_type: "authorization_code",
	};

	const response = await fetch(tokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(data),
	});

	const json = await response.json();

	console.log("🔐 SAVE THIS REFRESH TOKEN:");
	console.log(json.refresh_token);

	return NextResponse.json(json);
}
