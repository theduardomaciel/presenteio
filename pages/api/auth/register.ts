import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";

import jwt from 'jsonwebtoken';
import prisma from "../../../lib/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

export function getAppAuthenticationToken(account_id: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    return jwt.sign({ data: account_id }, jwtSecretKey, { expiresIn: "60d" });
}

router
    .post(async (req, res) => {
        const { name, email, password, image_url } = req.body;

        if (!name || !email || !password) {
            res.status(400).end("Name, email and password are required.");
            return;
        }

        try {
            const account = await prisma.account.create({
                data: {
                    name: name,
                    email: email,
                    password: password,
                    image_url: image_url ? image_url : null,
                },
            });
            console.log("Account created with success!")

            const token = getAppAuthenticationToken(account.id);
            res.status(200).json({ token: token, account: account });
        } catch (error) {
            console.log(error)
            res.status(500).end("There was not possible to create the account.");
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
