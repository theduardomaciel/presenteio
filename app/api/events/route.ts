import { verify } from "jsonwebtoken";
import prisma from "lib/prisma";

import { getImageUrl } from "../images/helper";

// Types
import { type NextRequest } from "next/server";
import { type PartialGuest } from "@/dashboard/components/Guest/GuestModal";
import { type TokenPayload } from "../auth/helper";

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
				color,
				allowInvite,
				allowProfileChange,
			} = await request.json();

			if (!name)
				return new Response("Name is required.", {
					status: 400,
					statusText: "Bad request.",
				});

			const imageResponse = await getImageUrl(image_base64, name);
			console.log("Image Response: " + imageResponse);

			const guestsToConnect = await Promise.all(
				guests.map(async (guest: PartialGuest) => {
					const guestImageResponse = guest.image_url
						? await getImageUrl(guest.image_url)
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
						color: color || undefined,
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
