import { type NextRequest } from "next/server";

import prisma from "lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(request: NextRequest) {
	const token = request.cookies.get("presenteio.token")?.value;

	if (!token) {
		return new Response("Unauthorized", {
			status: 401,
			statusText: "Unauthorized",
		});
	}

	if (!process.env.JWT_SECRET_KEY) {
		return new Response("Internal error", {
			status: 500,
			statusText: "Internal error",
		});
	}

	try {
		const authenticated = verify(token, process.env.JWT_SECRET_KEY) as {
			data: string;
		};

		const account = await prisma.account.findUnique({
			where: {
				id: authenticated.data,
			},
		});

		return Response.json(account);
	} catch (error) {
		console.log(error);
		return new Response(error as string, {
			status: 500,
			statusText: "Internal error",
		});
	}
}
