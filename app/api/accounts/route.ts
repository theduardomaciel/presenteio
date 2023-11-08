import { type NextRequest } from "next/server";

import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const token = request.cookies.get("presenteio.token");

	if (!token) {
		return new Response("Unauthorized", {
			status: 401,
			statusText: "Unauthorized",
		});
	}

	try {
		const authenticated = verify(
			token.value,
			process.env.JWT_SECRET_KEY as string
		) as { data: string };

		const userId = authenticated.data;

		const account = await prisma.account.findUnique({
			where: {
				id: userId,
			},
		});

		return Response.json(account);
	} catch (error) {
		console.log(error);
		return new Response("Internal error", {
			status: 500,
			statusText: "Internal error",
		});
	}
}
