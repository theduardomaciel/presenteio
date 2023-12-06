import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";

import prisma from "lib/prisma";
import { getAppAuthenticationToken, getGoogleData } from "../helper";

export async function POST(request: NextRequest) {
	const { email, password, access_token } = await request.json();

	if (!access_token && !email && !password) {
		return new Response(
			"Email and password or access_token are required.",
			{
				status: 400,
				statusText: "Bad request.",
			}
		);
	}

	const googleUser = access_token ? await getGoogleData(access_token) : null;

	if (access_token && !googleUser) {
		return new Response(
			"There was not possible to get the user information from Google.",
			{
				status: 500,
				statusText: "Internal server error.",
			}
		);
	}

	try {
		const account = await prisma.account.findUnique({
			where: {
				email: email || googleUser?.email,
			},
		});

		// Checamos se o usuário existe
		if (!account) {
			console.log("Account not found.");
			return new Response("Account not found.", {
				status: 404,
				statusText: "Account not found.",
			});
		}

		// Checamos se a senha está correta (caso não seja uma conta do Google)
		if (!googleUser && account.password) {
			const valid = await bcrypt.compare(password, account.password);

			if (!valid) {
				console.log("E-mail or password is incorrect.");
				return NextResponse.json({
					error: "E-mail or password is incorrect.",
					status: 400,
					statusText: "Bad request.",
				});
			}
		}

		const token = getAppAuthenticationToken(account.id);

		const response = NextResponse.json(account, {
			status: 200,
			statusText: "Login successful.",
		});

		response.cookies.set("presenteio.token", token, {
			httpOnly: true,
			path: "/",
		});

		return response;
	} catch (error) {
		console.log(error);
		return new Response(
			"There was a error while trying to authenticate the account.",
			{
				status: 500,
				statusText: "Internal server error.",
			}
		);
	}
}
