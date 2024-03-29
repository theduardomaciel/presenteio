import { type NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from "lib/prisma";

import { sendRevealEmailToGuest } from "app/api/emails/send/helper";

// Types
import { type Event, type Guest, EventStatus } from "@prisma/client";
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

	let guestsAlreadyRaffledIds: string[] = [];

	const guests = await Promise.all(
		await event.guests.map((guest) => {
			const guestRaffle = getRandomRaffle(
				event,
				guestsAlreadyRaffledIds,
				guest
			);
			return { ...guest, correspondingGuest: guestRaffle };
		})
	);

	//console.log(guests.map(guest => `${guest.name} -> ${guest.correspondingGuest.name}`))

	try {
		await sendAllEmails(guests, event);
		const updatedEvent = await prisma.event.update({
			where: {
				id,
			},
			data: {
				status: EventStatus.DIVULGED,
				guests: {
					update: guests.map((guest) => {
						return {
							where: {
								id: guest.id,
							},
							data: {
								correspondingGuest: {
									connect: {
										id: guest.correspondingGuest.id,
									},
								},
							},
						};
					}),
				},
			},
		});
		console.log(
			`Os convidados do evento ${updatedEvent.name} foram sorteados com sucesso!`
		);
		return Response.json(updatedEvent);
	} catch (error) {
		console.log(error);
	}
}

const isAlreadyRaffled = (id: string, guestsAlreadyRaffledIds: string[]) =>
	guestsAlreadyRaffledIds.includes(id);

function getRandomRaffle(
	event: Event & { guests: Guest[] },
	guestsAlreadyRaffledIds: string[],
	guest: Guest
) {
	const availableGuests = event!.guests.filter(
		(iterationGuest) =>
			iterationGuest.id !== guest.id &&
			!isAlreadyRaffled(iterationGuest.id, guestsAlreadyRaffledIds)
	);

	const randomGuest =
		availableGuests?.[Math.floor(Math.random() * availableGuests.length)];

	guestsAlreadyRaffledIds.push(randomGuest.id);
	return randomGuest;
}

async function sendAllEmails(guests: Guest[], event: Event) {
	await Promise.all(
		guests.map(async (guest) => {
			if (guest.email) {
				console.log(`Sending email to ${guest.email}`);
				await sendRevealEmailToGuest(guest.email as string, {
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
