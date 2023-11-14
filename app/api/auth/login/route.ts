import { NextResponse, type NextRequest } from "next/server";

import prisma from "lib/prisma";
import { verify } from "jsonwebtoken";
import {
	type TokenPayload,
	getAppAuthenticationToken,
	getGoogleData,
} from "../register/route";

export async function GET(
	request: NextRequest,
	{
		params,
	}: {
		params: {
			token: string;
		};
	}
) {
	const { token } = params;

	if (token) {
		const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

		if (!jwtSecretKey) {
			return new Response("JWT_SECRET_KEY is not defined.", {
				status: 500,
				statusText: "Internal server error.",
			});
		}

		try {
			const payload = verify(
				token as string,
				jwtSecretKey
			) as TokenPayload;

			try {
				const account = await prisma.account.findUnique({
					where: {
						id: payload.data,
					},
				});

				if (account) {
					console.log("Conta encontrada com sucesso!");
					return Response.json(account);
				} else {
					console.log("Conta não encontrada.");
					return new Response("Account not found.", {
						status: 404,
						statusText: "Account not found.",
					});
				}
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
		} catch (error) {
			console.log(error);
			return new Response("Your token is invalid.", {
				status: 400,
				statusText: "Malformed request.",
			});
		}
	} else {
		console.log("Token não encontrado.");
		return new Response("Token not provided.", {
			status: 400,
			statusText: "Malformed request.",
		});
	}
}

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

		if (account) {
			console.log("Conta encontrada com sucesso!");

			if (!googleUser && account.password !== password) {
				console.log("Porém, a senha está incorreta.");

				return new Response("E-mail or password is incorrect.", {
					status: 400,
					statusText: "Bad request.",
				});
			}

			const token = getAppAuthenticationToken(account.id);

			const response = NextResponse.json(account, {
				status: 200,
			});

			response.cookies.set({
				name: "presenteio.token",
				value: token,
				path: "/",
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 30,
			});

			return response;
		} else {
			console.log("Conta não encontrada.");
			return new Response("Account not found.", {
				status: 404,
				statusText: "Account not found.",
			});
		}
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
