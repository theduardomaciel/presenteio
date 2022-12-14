import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import multer from 'multer';

// API
import { ImgurClient } from 'imgur';
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID, clientSecret: process.env.IMGUR_CLIENT_SECRET });

const router = createRouter<NextApiRequest, NextApiResponse>();

export async function getImageUrl(image_base64: string, name?: string) {
    if (image_base64) {
        try {
            const response = await client.upload({
                image: image_base64,
                title: `${name}_eventImage`,
                type: "base64",
            });
            if (response.status === 200) {
                console.log("✅ Image uploaded with success!");
                return { image_url: response.data.link, image_deleteHash: response.data.deletehash };
            } else {
                console.log(response.data)
                console.log("❌ There was not possible to upload the image.",);
                return null;
            }
        } catch (error) {
            console.log(error)
            console.log("❌ There was not possible to upload the image.",);
            return null;
        }
    } else {
        console.log("Nenhuma string informada.")
        return null;
    }
}

export async function deleteImage(image_deleteHash: string) {
    if (image_deleteHash) {
        try {
            const response = await client.deleteImage(image_deleteHash);
            if (response.status === 200) {
                console.log("✅ Image deleted with success!");
                return true;
            } else {
                console.log("❌ There was not possible to delete the image.",);
                return null;
            }
        } catch (error) {
            console.log(error)
            console.log("❌ There was not possible to delete the image.",);
            return null;
        }
    } else {
        console.log("Nenhum delete hash informado.")
        return null;
    }
}

router
    .post(async (req, res) => {
        const { image_base64, name } = req.body;
        try {
            const image_url = await getImageUrl(image_base64, name);
            res.status(200).json({ image_url: image_url })
        } catch (error) {
            res.status(500).end(`Internal error.`);
        }
    })
    .delete(async (req, res) => {
        const { image_deleteHash } = req.query;

        if (!image_deleteHash) return res.status(400).end("Image deleteHash is required.");

        try {
            const response = await client.deleteImage(image_deleteHash as string)
            console.log("✅ DELETED image with success!");
            return response.data;
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