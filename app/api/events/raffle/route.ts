import { type NextRequest } from "next/server";
import prisma from "lib/prisma";

import { sendEmailToGuest } from "app/api/emails/send/route";

// Types
import { type Event, type Guest, EventStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
	const { id } = await request.json();

	if (!id) {
		return new Response("Email is not provided", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	const event = await prisma.event.findUnique({
		where: {
			id: parseInt(id as string),
		},
		include: {
			guests: true,
		},
	});

	if (!event) {
		return new Response("Event not found", {
			status: 404,
			statusText: "Not Found",
		});
	}

	const eventGuests = event.guests as Guest[];

	let guestsAlreadyRaffledIds: string[] = [];
	const isAlreadyRaffled = (id: string) =>
		guestsAlreadyRaffledIds.includes(id);

	function getRandomRaffle(guest: Guest) {
		const availableGuests = eventGuests.filter(
			(iterationGuest) =>
				iterationGuest.id !== guest.id &&
				isAlreadyRaffled(iterationGuest.id) === false
		);
		const randomGuest =
			availableGuests[Math.floor(Math.random() * availableGuests.length)];
		guestsAlreadyRaffledIds.push(randomGuest.id);
		return randomGuest;
	}

	const guests = await Promise.all(
		await eventGuests.map((guest) => {
			const guestRaffle = getRandomRaffle(guest);
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

async function sendAllEmails(guests: Guest[], event: Event) {
	await Promise.all(
		guests.map(async (guest) => {
			if (guest.email) {
				console.log(`Sending email to ${guest.email}`);
				await sendEmailToGuest(guest.email as string, {
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
