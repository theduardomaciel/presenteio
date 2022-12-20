import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";

import jwt from 'jsonwebtoken';

import prisma from "../../../lib/prisma";
import { getImageUrl } from '../uploadImage';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .post(async (req, res) => {
        const { eventId, name, email, image_base64 } = req.body;

        if (!name) {
            res.status(400).end("Name is required.");
            return;
        }

        if (!eventId) {
            res.status(400).end("EventId is required.");
        }

        const imageResponse = image_base64 ? await getImageUrl(image_base64) : null;

        try {
            const guest = await prisma.guest.create({
                data: {
                    event: {
                        connect: {
                            id: parseInt(eventId)
                        }
                    },
                    name: name,
                    email: email || undefined,
                    image_url: imageResponse ? imageResponse.image_url : undefined,
                    image_deleteHash: imageResponse ? imageResponse.image_deleteHash : undefined,
                }
            });

            res.status(200).json(guest);
        } catch (error) {
            console.log(error)
            res.status(500).end("There was not possible to create the guest.");
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
