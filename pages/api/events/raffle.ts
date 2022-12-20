import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

import { verify } from "jsonwebtoken";

import prisma from "../../../lib/prisma";
import extractToken from "../../../lib/extractToken";
import { getImageUrl } from "../uploadImage";
import Guest from "types/Guest";
import { PreGuest } from "@dashboard/components/Guest/PreGuestsDisplay";

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };
const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    .post(async (req, res) => {
        const token = extractToken(req) as string | null;
        if (!token) return res.status(401).end("Unauthorized");

        const { eventId } = req.body;



        try {
            const authenticated = verify(token, process.env.JWT_SECRET_KEY as string) as { data: string };
            if (authenticated) {
                /* const event = await prisma.event.update({
                    where: {
                        id: eventId,
                    },
                    data: {
                        guests: {
                        }
                    }
                }) */
            } else {
                return res.status(401).end("Unauthorized");
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