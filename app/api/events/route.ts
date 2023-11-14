import { decode, verify } from "jsonwebtoken";
import prisma from "lib/prisma";

import { getImageUrl } from "../images/route";

// Types
import { type NextRequest } from "next/server";
import { type PreGuest } from "app/dashboard/compose/PreGuestsDisplay";
import { TokenPayload } from "../auth/register/route";

export async function POST(request: NextRequest) {
	try {
		const token = request.cookies.get("presenteio.token")?.value;

		if (token) {
			const {
				name,
				guests,
				image_base64,
				minPrice,
				maxPrice,
				allowInvite,
				allowProfileChange,
			} = await request.json();

			if (!name)
				return new Response("Name is required.", { status: 400 });

			const imageResponse = await getImageUrl(image_base64, name);
			console.log("Image Response: " + imageResponse);

			const guestsToConnect = await Promise.all(
				guests.map(async (guest: PreGuest) => {
					const guestImageResponse = guest.imagePreview
						? await getImageUrl(guest.imagePreview as string)
						: undefined;
					return {
						name: guest.name,
						email: guest.email,
						image_url: guestImageResponse?.image_url || undefined,
						image_deleteHash:
							guestImageResponse?.image_deleteHash || undefined,
					};
				})
			);

			try {
				const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
				const payload = verify(token, jwtSecretKey) as TokenPayload;

				const event = await prisma.event.create({
					data: {
						host: {
							connect: {
								id: payload.data,
							},
						},
						guests: guestsToConnect
							? { create: guestsToConnect }
							: {},
						name: name,
						minPrice: minPrice ? parseFloat(minPrice) : null,
						maxPrice: maxPrice ? parseFloat(maxPrice) : null,
						allowInvite: allowInvite ? true : false,
						allowProfileChange: allowProfileChange ? true : false,
						image_url: imageResponse?.image_url || undefined,
						image_deleteHash:
							imageResponse?.image_deleteHash || undefined,
					},
				});
				console.log("🎫 Evento criado com sucesso!");
				return Response.json(event);
			} catch (error) {
				console.log(error);
				return new Response(
					"There was a error while trying to authenticate the account.",
					{
						status: 500,
						statusText:
							(error as string) ||
							"There was a error while trying to authenticate the account.",
					}
				);
			}
		} else {
			return new Response("Unauthorized", {
				status: 401,
				statusText: "Unauthorized",
			});
		}
	} catch (error) {
		console.log(error);
		return new Response(
			"There was a error while trying to create the event.",
			{
				status: 500,
				statusText: "Internal server error.",
			}
		);
	}
}
