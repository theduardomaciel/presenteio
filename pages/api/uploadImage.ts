import { createRouter, expressWrapper } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

// Middlewares
import multer from 'multer';

// API
import { ImgurClient } from 'imgur';
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID, clientSecret: process.env.IMGUR_CLIENT_SECRET });

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

// File upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadMiddleware = upload.single('blob');

export async function getImageUrl(file: File) {
    if (file) {
        try {
            const response = await client.upload({
                image: file.stream(),
                type: 'stream',
            });
            console.log(response.data.link, response.data.deletehash);
            return { image_url: response.data.link, image_deleteHash: response.data.deletehash };
        } catch (error) {
            console.log(error)
            return null;
        }
    } else {
        console.log("Nenhum arquivo informado.")
        return null;
    }
}

router
    .use(expressWrapper(uploadMiddleware) as any) // express middleware are supported if you wrap it with expressWrapper
    .post(async (req, res) => {
        const image_url = getImageUrl(req.file);
        res.status(200).json({ image_url: image_url })
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