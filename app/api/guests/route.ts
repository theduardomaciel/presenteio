import prisma from "lib/prisma";
import { getImageUrl } from "../images/route";

// Types
import { GuestStatus } from "@prisma/client";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const { eventId, name, email, status, image_base64 } = await request.json();

	if (!name) {
		return new Response("Name is required.", {
			status: 400,
			statusText: "Bad request.",
		});
	}

	if (!eventId) {
		return new Response("Event id is required.", {
			status: 400,
			statusText: "Bad request.",
		});
	}

	const imageResponse = image_base64 ? await getImageUrl(image_base64) : null;

	try {
		const guest = await prisma.guest.create({
			data: {
				event: {
					connect: {
						id: parseInt(eventId),
					},
				},
				name: name,
				status: status || GuestStatus.PENDING,
				email: email || undefined,
				image_url: imageResponse ? imageResponse.image_url : undefined,
				image_deleteHash: imageResponse
					? imageResponse.image_deleteHash
					: undefined,
			},
		});
		return Response.json(guest);
	} catch (error) {
		console.log(error);
		return new Response("There was not possible to create the guest.", {
			status: 500,
			statusText: "Internal server error.",
		});
	}
}
