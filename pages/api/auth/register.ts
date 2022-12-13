import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter, expressWrapper } from "next-connect";

import prisma from "../../../lib/prisma";
import uploadImage, { getImageUrl } from '../uploadImage';

// Middlewares
import multer from 'multer';

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };

const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

// File upload
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const uploadMiddleware = upload.single('blob');

router
    .use(expressWrapper(uploadMiddleware) as any) // express middleware are supported if you wrap it with expressWrapper
    .post(async (req, res) => {
        const { name, email, password } = req.body;

        const image_url = await getImageUrl(req);

        try {
            const account = await prisma.account.create({
                data: {
                    name: name,
                    email: email,
                    password: password,
                    image_url: image_url,
                }
            })
            res.status(200).json(account)
        } catch (error) {
            console.log(error)
            res.status(501).json({ error: error })
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
