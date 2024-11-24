import { type NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from "lib/prisma";

import { sendConfirmationEmailToGuest, sendRevealEmailToGuest } from "app/api/emails/send/helper";

// Types
import { type Event, type Guest } from "@prisma/client";
import type { TokenPayload } from "app/api/auth/helper";

export async function POST(request: NextRequest) {
	const { id } = await request.json();
	const token = request.cookies.get("presenteio.token")?.value;

	if (!id) {
		return new Response("Event id has not been provided", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	if (!token) {
		return new Response("Token has not been provided", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	const event = await prisma.event.findUnique({
		where: {
			id: id,
		},
		include: {
			guests: true,
			host: true,
		},
	});

	if (!event) {
		return new Response("Event not found", {
			status: 404,
			statusText: "Not Found",
		});
	}

	const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
	const payload = verify(token, jwtSecretKey) as TokenPayload;

	if (event.host.id !== payload.data) {
		return new Response("You are not the host of this event", {
			status: 403,
			statusText: "Forbidden",
		});
	}

	try {
		await sendAllEmails(event.guests, event);

		console.log(
			`Os convidados do evento ${event.name} foram notificados para confirmar presença`
		);
		return Response.json({
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
}

async function sendAllEmails(guests: Guest[], event: Event) {
	await Promise.all(
		guests.map(async (guest) => {
			if (guest.email && guest.email == "eduardomacielbr@gmail.com") {
				console.log(`Sending email to ${guest.email}`);
				await sendConfirmationEmailToGuest(guest.email as string, {
					guestName: guest.name,
					guestId: guest.id,
					eventName: event?.name,
					eventType: event?.type,
					eventInviteCode: event?.inviteCode,
				});
			}
		})
	);
}
