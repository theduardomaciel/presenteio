import { type NextRequest } from "next/server";

import prisma from "lib/prisma";
import { deleteImage, getImageUrl } from "app/api/images/route";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	const {
		name,
		color,
		image_base64,
		minPrice,
		maxPrice,
		allowInvite,
		allowProfileChange,
	} = await request.json();

	if (!id) {
		return new Response("The id was not provided.", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	if (image_base64) {
		try {
			const event = await prisma.event.findUnique({
				where: {
					id: id,
				},
			});

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
				minPrice: parseInt(minPrice) || undefined,
				maxPrice: parseInt(maxPrice) || undefined,
				color: color || undefined,
				allowInvite: allowInvite ? true : false,
				allowProfileChange: allowProfileChange ? true : false,
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

	if (!id) {
		return new Response("The id was not provided.", {
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
			},
		});
		if (event && event.image_deleteHash) {
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
		const event = await prisma.event.delete({
			where: {
				id: id,
			},
		});

		console.log("Evento excluído com sucesso.");
		return Response.json(event);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong. Please try again later.", {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
