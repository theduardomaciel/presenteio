import { cache } from "react";
import "server-only";

import prisma from "../prisma";

export const preload = (id: string) => {
	void getGuest(id);
};

export const getGuest = cache(async (id?: string, hash?: string) => {
	if (!id && !hash) return null;

	try {
		if (id) {
			const guest = await prisma.guest.findFirst({
				where: {
					id,
				},
				include: {
					event: false,
					correspondingGuest: true,
				},
			});

			// console.log("Fetched guest by ID:", guest);

			return guest;
		} else {
			const guest = await prisma.guest.findFirst({
				where: {
					customHash: hash,
				},
				include: {
					event: false,
					correspondingGuest: true,
				},
			});

			// console.log("Fetched guest by hash:", guest);

			return guest;
		}
	} catch (error) {
		console.log(error);
	}
});
