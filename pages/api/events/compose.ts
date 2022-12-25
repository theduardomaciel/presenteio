import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

import { decode, verify } from "jsonwebtoken";

import prisma from "../../../lib/prisma";
import { getImageUrl } from "../images/uploadImage";

import { PreGuest } from "app/dashboard/compose/PreGuestsDisplay";

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };
const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    .post(async (req, res) => {
        try {
            const userId = decode(req.cookies['presenteio.token'] as string) as string;
            if (userId) {
                const { name, guests, image_base64, minPrice, maxPrice, allowInvite, allowProfileChange } = req.body;

                if (!name) return res.status(400).end("Name is required.");

                const imageResponse = await getImageUrl(image_base64, name)
                console.log(imageResponse)

                const guestsToConnect = await Promise.all(guests.map(async (guest: PreGuest) => {
                    const guestImageResponse = guest.imagePreview ? await getImageUrl(guest.imagePreview as string) : undefined;
                    return {
                        name: guest.name,
                        email: guest.email,
                        image_url: guestImageResponse ? guestImageResponse.image_url : null,
                        image_deleteHash: guestImageResponse ? guestImageResponse.image_deleteHash : null,
                    }
                }));

                try {
                    const event = await prisma.event.create({
                        data: {
                            host: {
                                connect: {
                                    id: userId,
                                }
                            },
                            guests: guestsToConnect ? { create: guestsToConnect } : {},
                            name: name,
                            minPrice: minPrice ? parseFloat(minPrice) : null,
                            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                            allowInvite: allowInvite ? true : false,
                            allowProfileChange: allowProfileChange ? true : false,
                            image_url: imageResponse && imageResponse.image_url ? imageResponse.image_url : null,
                            image_deleteHash: imageResponse && imageResponse.image_deleteHash ? imageResponse.image_deleteHash : null,
                        },
                    })
                    console.log("Evento criado com sucesso.")
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

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});