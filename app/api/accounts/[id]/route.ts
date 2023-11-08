import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";
import { decode, verify } from "jsonwebtoken";

router.get(async (req, res) => {
	const tokenCookie = req.cookies["presenteio.token"] as string;
	try {
		const authenticated = verify(
			tokenCookie,
			process.env.JWT_SECRET_KEY as string
		) as { data: string };
		const userId = authenticated.data;

		const account = await prisma.account.findUnique({
			where: {
				id: userId,
			},
		});
		res.status(200).json(account);
	} catch (error) {
		console.log(error);
		return res.status(500).end(`Internal error.`);
	}
});

export default router.handler({
	onError: (err: any, req, res) => {
		console.error(err.stack);
		res.status(500).end("Something broke!");
	},
	onNoMatch: (req, res) => {
		res.status(404).end("Page is not found");
	},
});
