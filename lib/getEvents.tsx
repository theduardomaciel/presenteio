import "server-only";
import { cache } from "react";

import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

import prisma from "./prisma";
import type { TokenPayload } from "app/api/auth/helper";

export const preload = () => {
	void getEvents();
};

export const getEvents = cache(async () => {
	const token = cookies().get("presenteio.token");

	if (!token || !verify) throw new Error("No token found");

	try {
		const payload = verify(
			token?.value as string,
			process.env.JWT_SECRET_KEY as string
		) as TokenPayload;

		if (payload) {
			const events = await prisma.event.findMany({
				where: {
					accountId: payload.data as string,
				},
				include: {
					guests: true,
				},
			});

			return events;
		}
	} catch (error) {
		console.log(error);
	}
});

export const getEvent = cache(async (id: string) => {
	if (!id) return null;

	const nextCookies = cookies();
	const token = nextCookies.get("presenteio.token");

	if (!token) return;

	try {
		const response = verify(
			token?.value as string,
			process.env.JWT_SECRET_KEY as string
		) as TokenPayload;
		if (response) {
			const event = await prisma.event.findUnique({
				where: {
					id: id,
				},
				include: {
					guests: {
						include: {
							event: false,
							correspondingGuest: true,
						},
					},
				},
			});

			return event;
		}
	} catch (error) {
		console.log(error);
	}
});

export const getEventFromInviteCode = cache(async (inviteCode: string) => {
	if (!inviteCode) return null;

	try {
		const event = await prisma.event.findUnique({
			where: {
				inviteCode: inviteCode,
			},
			include: {
				guests: true,
			},
		});

		return event;
	} catch (error) {
		console.log(error);
	}
});
