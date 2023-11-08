import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>();

import prisma from "../../../lib/prisma";

import { deleteImage, getImageUrl } from "../images/uploadImage";

router
    .patch(async (req, res) => {
        const id = req.query.id as string;
        const { name, email, image_deleteHash, status, image_base64 } = req.body;

        if (!id) {
            return res.status(400).end("Bad request. The id was not provided.");
        }

        try {
            if (image_deleteHash) {
                deleteImage(image_deleteHash)
            }
        } catch (error) {
            console.log(error)
        }

        const imageResponse = image_base64 ? await getImageUrl(image_base64) as any : null;

        try {
            const defaultGuest = await prisma.guest.findUnique({
                where: {
                    id: id,
                }
            })

            const responseGuest = await prisma.guest.update({
                where: {
                    id: id,
                },
                data: {
                    name: name || defaultGuest?.name,
                    email: email || defaultGuest?.email,
                    status: status || defaultGuest?.status,
                    image_url: imageResponse ? imageResponse.image_url : defaultGuest?.image_url,
                    image_deleteHash: imageResponse ? imageResponse.image_deleteHash : defaultGuest?.image_deleteHash,
                }
            })
            return res.status(200).json(responseGuest);
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
            const guest = await prisma.guest.findUnique({
                where: {
                    id: id,
                }
            })
            if (guest && guest.image_deleteHash) {
                deleteImage(guest.image_deleteHash)
            }
        } catch (error) {
            console.log(error)
        }

        try {
            const guest = await prisma.guest.delete({
                where: {
                    id: id,
                }
            })

            return res.status(200).json(guest);
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