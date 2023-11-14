import { type NextRequest } from "next/server";

import prisma from "lib/prisma";

export async function POST(request: NextRequest) {
	const { email } = await request.json();

	if (email) {
		try {
			const account = await prisma.account.findUnique({
				where: {
					email: email as string,
				},
			});
			if (account) {
				console.log(account);
				return Response.json(true);
			} else {
				console.log("E-mail não encontrado");
				return Response.json(false);
			}
		} catch (error) {
			console.log(error);
			return new Response(error as string, {
				status: 501,
				statusText: "Internal Server Error",
			});
		}
	} else {
		return new Response("Email is not provided", {
			status: 400,
			statusText: "Bad Request",
		});
	}
}
