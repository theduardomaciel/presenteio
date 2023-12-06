import prisma from "lib/prisma";
import { verify } from "jsonwebtoken";

// Helpers
import { deleteImage, getImageUrl } from "app/api/images/helper";

// Types
import { type NextRequest } from "next/server";
import type { TokenPayload } from "app/api/auth/helper";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	const token = request.cookies.get("presenteio.token")?.value;

	const {
		name,
		color,
		image_base64,
		minPrice,
		maxPrice,
		allowInvite,
		allowRevealFromPage,
		allowProfileChange,
		allowEmailChange,
		reset,
	} = await request.json();

	if (!id) {
		return new Response("The id was not provided.", {
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

	try {
		const event = await prisma.event.findUnique({
			where: {
				id: id,
			},
			include: {
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

		// Check if the user is the host of the event
		if (event.host.id !== payload.data) {
			return new Response("You are not the host of this event", {
				status: 403,
				statusText: "Forbidden",
			});
		}

		// Delete the old image if a new one is provided
		if (image_base64) {
			try {
				event?.image_deleteHash &&
					(await deleteImage(event.image_deleteHash));
			} catch (error) {
				console.log(error);

				return new Response(
					"There was a problem while trying to delete a picture. Try again later.",
					{
						status: 500,
						statusText: "Internal Server Error",
					}
				);
			}
		}
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong. Please try again later.", {
			status: 500,
			statusText: "Internal Server Error",
		});
	}

	// Reset the event
	if (reset) {
		await prisma.guest.updateMany({
			where: {
				eventId: id,
			},
			data: {
				guestId: null,
				status: "PENDING",
			},
		});
	}

	const updatedImageUrl = image_base64
		? await getImageUrl(image_base64)
		: null;

	try {
		const event = await prisma.event.update({
			where: {
				id: id,
			},
			data: {
				name: name || undefined,
				image_url: updatedImageUrl?.image_url || undefined,
				image_deleteHash:
					updatedImageUrl?.image_deleteHash || undefined,
				minPrice: minPrice ? parseInt(minPrice) : undefined,
				maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
				color: color || undefined,
				allowInvite: allowInvite ? true : undefined,
				allowRevealFromPage: allowRevealFromPage ? true : undefined,
				allowProfileChange: allowProfileChange ? true : undefined,
				allowEmailChange: allowEmailChange ? true : undefined,
				status: reset ? "PENDING" : undefined,
			},
		});

		console.log("Evento atualizado com sucesso.");
		return Response.json(event);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong. Please try again later.", {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	const token = request.cookies.get("presenteio.token")?.value;

	if (!id) {
		return new Response("The id was not provided.", {
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

	try {
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

		// Check if the user is the host of the event
		if (event.host.id !== payload.data) {
			return new Response("You are not the host of this event", {
				status: 403,
				statusText: "Forbidden",
			});
		}

		if (event.image_deleteHash) {
			deleteImage(event.image_deleteHash);

			if (event.guests.length > 0) {
				event.guests.forEach(async (guest) => {
					if (guest.image_deleteHash) {
						deleteImage(guest.image_deleteHash);
					}
				});
			}
		}
	} catch (error) {
		console.log(error);
	}

	try {
		await prisma.$transaction([
			prisma.guest.updateMany({
				where: {
					eventId: id,
				},
				data: {
					guestId: null,
				},
			}),
			prisma.event.delete({
				where: {
					id: id,
				},
			}),
		]);

		console.log("Evento excluído com sucesso.");
		return new Response("Event deleted successfully.", {
			status: 200,
			statusText: "OK",
		});
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong. Please try again later.", {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
