import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";

import prisma from "../../lib/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .get(async (req, res) => {
        const { email } = req.query;

        if (email) {
            try {
                const account = await prisma.account.findUnique({
                    where: {
                        email: email as string
                    }
                })
                if (account) {
                    console.log(account)
                    res.status(200).send(true)
                } else {
                    console.log("E-mail não encontrado")
                    res.status(200).send(false)
                }
            } catch (error) {
                console.log(error)
                res.status(501).json({ error: error })
            }
        } else {
            res.status(400).json({ error: "Email is not provided" })
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
