import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>();

import prisma from "../../../lib/prisma";

import { verify } from "jsonwebtoken";
import extractToken from "../../../lib/extractToken";

import { deleteImage, getImageUrl } from "../images/uploadImage";
import { PreGuest } from "@dashboard/components/Guest/PreGuestsDisplay";

router
    .patch(async (req, res) => {
        const id = req.query.id as string;
        const { name, type, color, image_base64, minPrice, maxPrice, allowInvite, allowProfileChange } = req.body;

        if (!id) {
            return res.status(400).end("Bad request. The id was not provided.");
        }

        const imageResponse = image_base64 ? await getImageUrl(image_base64) : null;

        try {
            const defaultEvent = await prisma.event.findUnique({
                where: {
                    id: parseInt(id),
                }
            })

            const event = await prisma.event.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name || defaultEvent?.name,
                    image_url: imageResponse ? imageResponse.image_url : defaultEvent?.image_url,
                    image_deleteHash: imageResponse ? imageResponse.image_deleteHash : defaultEvent?.image_deleteHash,
                    minPrice: parseInt(minPrice) || defaultEvent?.minPrice,
                    maxPrice: parseInt(maxPrice) || defaultEvent?.maxPrice,
                    allowInvite: allowInvite ? true : false,
                    allowProfileChange: allowProfileChange ? true : false,
                }
            })

            console.log("Evento atualizado com sucesso.")
            return res.status(200).json(event);
        } catch (error) {
            console.log(error)
            return res.status(500).end("Something went wrong. Please try again later.");
        }
    })
    .delete(async (req, res) => {
        const id = req.query.id as string;

        if (!id) {
            return res.status(400).end("Bad request. The id was not provided.");
        }

        try {
            const event = await prisma.event.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    guests: true
                }
            })
            if (event && event.image_deleteHash) {
                deleteImage(event.image_deleteHash)

                if (event.guests.length > 0) {
                    event.guests.forEach(async guest => {
                        if (guest.image_deleteHash) {
                            deleteImage(guest.image_deleteHash)
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }

        try {
            const event = await prisma.event.delete({
                where: {
                    id: parseInt(id),
                }
            })

            console.log("Evento excluído com sucesso.")
            return res.status(200).json(event);
        } catch (error) {
            console.log(error)
            return res.status(500).end("Something went wrong. Please try again later.");
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