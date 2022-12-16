import { createRouter, expressWrapper } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>();

import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";
import extractToken from "../../../lib/extractToken";

router
    .get(async (req, res) => {
        const token = extractToken(req) as string | null;
        if (!token) return res.status(401).end("Unauthorized");

        try {
            const authenticated = verify(token, process.env.JWT_SECRET_KEY as string) as { data: string };
            if (authenticated) {
                const userId = authenticated.data as string;

                try {
                    const account = await prisma.account.findUnique({
                        where: {
                            id: userId,
                        }
                    });
                    res.status(200).json(account);
                } catch (error) {
                    console.log(error)
                    return res.status(500).end(`Error: ${error}`);
                }
            }
        } catch (error) {
            console.log(error)
        }
    })

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});