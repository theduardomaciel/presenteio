import { type NextRequest } from "next/server";

import prisma from "lib/prisma";

import { deleteImage, getImageUrl } from "../../images/route";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const { name, email, image_deleteHash, status, image_base64 } =
		await request.json();

	if (!id) {
		return new Response("Bad request. The id was not provided.", {
			status: 400,
			statusText: "Bad request. The id was not provided.",
		});
	}

	try {
		if (image_deleteHash) {
			await deleteImage(image_deleteHash);
		}
	} catch (error) {
		console.log(error);
	}

	const imageResponse = image_base64 ? await getImageUrl(image_base64) : null;

	try {
		const responseGuest = await prisma.guest.update({
			where: {
				id: id,
			},
			data: {
				name: name || undefined,
				email: email || undefined,
				status: status || undefined,
				image_url: imageResponse
					? imageResponse?.image_url || undefined
					: undefined,
				image_deleteHash: imageResponse
					? imageResponse?.image_deleteHash || undefined
					: undefined,
			},
		});
		return Response.json(responseGuest);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong. Please try again later.", {
			status: 500,
			statusText: "Something went wrong. Please try again later.",
		});
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	if (!id) {
		return new Response("Bad request. The id was not provided.", {
			status: 400,
			statusText: "Bad request. The id was not provided.",
		});
	}

	try {
		const guest = await prisma.guest.findUnique({
			where: {
				id: id,
			},
		});
		if (guest && guest.image_deleteHash) {
			await deleteImage(guest.image_deleteHash);
		}
	} catch (error) {
		console.log(error);
	}

	try {
		const guest = await prisma.guest.delete({
			where: {
				id: id,
			},
		});

		return new Response("Guest deleted successfully.", {
			status: 200,
			statusText: "Guest deleted successfully.",
		});
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong. Please try again later.", {
			status: 500,
			statusText: "Something went wrong. Please try again later.",
		});
	}
}
