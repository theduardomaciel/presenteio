import React from 'react';
import { render } from '@react-email/render';

import sendgrid from '@sendgrid/mail';
import cors from 'cors';

import { createRouter, expressWrapper } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

import CodeEmail from 'components/emails/code';
import RevealEmail, { EmailProps } from 'components/emails/reveal';

const router = createRouter<NextApiRequest, NextApiResponse>();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendEmailToGuest(sendTo: string, emailProps: EmailProps) {
    const emailHtml = render(<RevealEmail {...emailProps} />, {
        pretty: true,
    });

    const options = {
        from: 'app.presenteio@gmail.com',
        to: sendTo,
        subject: 'Chegou a hora tão esperada! Vem conferir seu amigo secreto!',
        html: emailHtml,
    };

    try {
        sendgrid.send(options);
        console.log("E-mail sent with success!")
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

router
    .use(expressWrapper(cors()) as any) // express middleware are supported if you wrap it with expressWrapper
    .post(async (req, res) => {
        const { emailProps, sendTo, resendRevealEmail } = req.body;
        if (resendRevealEmail) {
            const response = await sendEmailToGuest(sendTo, emailProps)
            if (response) {
                res.status(200).end();
            } else {
                console.log("Não foi possível enviar o e-mail.")
                res.status(500).end("Something broke!");
            }
        } else {
            const emailHtml = render(<CodeEmail {...emailProps} />, {
                pretty: true,
            });

            const options = {
                from: 'app.presenteio@gmail.com',
                to: sendTo,
                subject: 'Seu código de verificação para concluir seu cadastro no presenteio',
                html: emailHtml,
            };

            try {
                sendgrid.send(options);
                res.status(200).end();
            } catch (error) {
                console.log(error)
                res.status(500).end("Something broke!");
            }
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