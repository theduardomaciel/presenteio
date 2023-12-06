import jwt from "jsonwebtoken";
import axios from "axios";

export interface TokenPayload {
	data: string;
}

export function getAppAuthenticationToken(account_id: string) {
	const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
	if (!jwtSecretKey) {
		throw new Error("Missing JWT_SECRET_KEY environment variable.");
	}

	return jwt.sign({ data: account_id }, jwtSecretKey, { expiresIn: "2d" });
}

interface GoogleResponse {
	email: string;
	given_name: string;
	family_name: string;
	picture: string;
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
