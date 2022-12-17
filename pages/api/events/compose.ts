import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

import { verify } from "jsonwebtoken";

import prisma from "../../../lib/prisma";
import extractToken from "../../../lib/extractToken";
import { getImageUrl } from "../uploadImage";
import Guest from "types/Guest";
import { PreGuest } from "@dashboard/components/GuestsDisplay";

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };
const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    .post(async (req, res) => {
        const token = extractToken(req) as string | null;
        if (!token) return res.status(401).end("Unauthorized");

        try {
            const authenticated = verify(token, process.env.JWT_SECRET_KEY as string) as { data: string };
            if (authenticated) {
                const userId = authenticated.data as string;
                const { name, guests, eventImage, minPrice, maxPrice, allowInvite, allowProfileChange } = req.body;

                if (!name) return res.status(400).end("Name is required.");

                const imageResponse = await getImageUrl(eventImage as File)

                const guestsToConnect = guests.map(async (guest: PreGuest) => {
                    const guestImageResponse = await getImageUrl(guest.image as File)
                    return {
                        name: guest.name,
                        email: guest.email,
                        image_url: guestImageResponse && guestImageResponse.image_url ? guestImageResponse.image_url : null,
                        image_deleteHash: guestImageResponse && guestImageResponse.image_deleteHash ? guestImageResponse.image_deleteHash : null,
                    }
                })

                try {
                    const event = await prisma.event.create({
                        data: {
                            host: {
                                connect: {
                                    id: userId,
                                }
                            },
                            guests: guests ? { connect: guestsToConnect } : undefined,
                            name: name,
                            minPrice: minPrice ? minPrice : null,
                            maxPrice: maxPrice ? maxPrice : null,
                            allowInvite: allowInvite ? allowInvite : false,
                            allowProfileChange: allowProfileChange ? allowProfileChange : false,
                            image_url: imageResponse && imageResponse.image_url ? imageResponse.image_url : null,
                            image_deleteHash: imageResponse && imageResponse.image_deleteHash ? imageResponse.image_deleteHash : null,
                        },
                    })
                    res.status(200).json(event);
                } catch (error) {
                    console.log(error)
                    return res.status(500).end(`Error: ${error}`);
                }
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