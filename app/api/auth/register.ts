import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";

import jwt from 'jsonwebtoken';
import prisma from "../../../lib/prisma";
import axios from 'axios';

const router = createRouter<NextApiRequest, NextApiResponse>();

export function getAppAuthenticationToken(account_id: string) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    return jwt.sign({ data: account_id }, jwtSecretKey, { expiresIn: "60d" });
}

export async function getGoogleData(access_token: string) {
    try {
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${access_token}` } })
        if (googleResponse.data) {
            return googleResponse.data;
        }
    } catch (error) {
        console.log(error)
        return null;
    }
}

router
    .post(async (req, res) => {
        const { name, email, password, access_token } = req.body;

        if (!access_token && !name && !password) {
            res.status(400).end("Name and email or access_token are required.");
            return;
        }

        const googleUser = access_token ? await getGoogleData(access_token) as { email: string, given_name: string, family_name: string, picture: string } : null;

        if (!googleUser && access_token) {
            res.status(500).end("There was not possible to get the user information from Google.");
        } else {
            const account = await prisma.account.findUnique({
                where: {
                    email: email || googleUser?.email,
                },
            });

            if (account) {
                res.status(400).end("Account already exists.");
                return;
            }
        };
        // Unique constraint failed on the (not available) -> erro acontece quando o email já existe

        console.log(name || googleUser?.given_name + " " + googleUser?.family_name, email || googleUser?.email)

        try {
            const googleName = googleUser?.given_name + " " + googleUser?.family_name ? googleUser?.family_name : "";
            const account = await prisma.account.create({
                data: {
                    name: name || googleName,
                    email: email || googleUser?.email,
                    password: password || null,
                    image_url: googleUser?.picture || null,
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
