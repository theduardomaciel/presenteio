// app/api/emails/test/route.ts
import { NextResponse } from "next/server";
import { getTransport } from "lib/email";

export async function POST(req: Request) {
	try {
		const { to, subject, message } = await req.json();

		await getTransport().send({
			from: process.env.GMAIL_ADDRESS!,
			to,
			subject,
			html: `<div style="font-family: sans-serif;">${message}</div>`,
		});

		return NextResponse.json({ ok: true });
	} catch (e: any) {
		console.error(e);
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
