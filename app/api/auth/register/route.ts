import { NextResponse, type NextRequest } from "next/server";

import jwt from "jsonwebtoken";
import axios from "axios";
import prisma from "lib/prisma";

export async function POST(request: NextRequest) {
	const { name, email, password, access_token } = await request.json();

	if (!access_token && !name && !password) {
		return new Response("Name and email or access_token are required.", {
			status: 400,
			statusText: "Bad request.",
		});
	}

	const googleUser = access_token
		? ((await getGoogleData(access_token)) as GoogleResponse)
		: null;

	if (!googleUser && access_token) {
		return new Response(
			"There was not possible to get the user information from Google.",
			{
				status: 500,
				statusText: "Internal server error.",
			}
		);
	} else {
		const account = await prisma.account.findUnique({
			where: {
				email: email || googleUser?.email,
			},
		});

		if (account) {
			return new Response("Account already exists.", {
				status: 409,
				statusText: "Account already exists.",
			});
		}
	}
	// Unique constraint failed on the (not available) -> erro acontece quando o email já existe

	try {
		const accountName =
			name ||
			`${googleUser?.given_name}${
				googleUser?.family_name ? ` ${googleUser?.family_name}` : ""
			}`;

		const account = await prisma.account.create({
			data: {
				name: accountName,
				email: email || googleUser?.email,
				password: password || null,
				image_url: googleUser?.picture || null,
			},
		});
		console.log("Account created with success!");

		const token = getAppAuthenticationToken(account.id);

		const response = NextResponse.json(account, {
			status: 201,
			statusText: "Account created with success!",
		});

		response.cookies.set({
			name: "presenteio.token",
			value: token,
			path: "/",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
		});

		return response;
	} catch (error) {
		console.log(error);
		return new Response("There was not possible to create the account.", {
			status: 500,
			statusText: "There was not possible to create the account.",
		});
	}
}

export interface TokenPayload {
	data: string;
}

export function getAppAuthenticationToken(account_id: string) {
	const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
	if (!jwtSecretKey) {
		throw new Error("Missing JWT_SECRET_KEY environment variable.");
	}

	return jwt.sign({ data: account_id }, jwtSecretKey, { expiresIn: "60d" });
}

export async function getGoogleData(access_token: string) {
	try {
		const googleResponse = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{ headers: { Authorization: `Bearer ${access_token}` } }
		);
		if (googleResponse.data) {
			return googleResponse.data as GoogleResponse;
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

interface GoogleResponse {
	email: string;
	given_name: string;
	family_name: string;
	picture: string;
}
