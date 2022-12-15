import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from "next-connect";

import { verify } from 'jsonwebtoken';
import prisma from "../../../lib/prisma";

import Account from '../../../types/Account';
import { getAppAuthenticationToken } from './register';

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .get(async (req, res) => {
        const { token } = req.query;

        if (token) {
            try {
                const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
                const accountInfo = verify(token as string, jwtSecretKey) as Account;
                try {
                    const account = await prisma.account.findUnique({
                        where: {
                            email: accountInfo.email,
                        },
                    });
                    if (account) {
                        console.log("Conta encontrada e atualizada com sucesso!")
                        res.status(200).json(account);
                    } else {
                        console.log("Conta não encontrada.")
                        res.status(400).end("Account not found.");
                    }
                } catch (error) {
                    console.log(error)
                    res.status(500).end("There was a error while trying to authenticate the account.");
                }
            } catch (error) {
                console.log(error)
                res.status(500).end("Your token is invalid.")
            }
        } else {
            console.log("Token não encontrado.")
            res.status(400).end("Token not found.");
        }
    })
    .post(async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "E-mail e senha são obrigatórios." })
            return;
        }

        try {
            const account = await prisma.account.findUnique({
                where: {
                    email: email,
                },
            });

            if (account) {
                console.log("Conta encontrada com sucesso!")

                if (account.password !== password) {
                    console.log("Senha incorreta.")
                    res.status(400).json({ error: "E-mail ou senha incorretos." });
                    return;
                }

                const token = getAppAuthenticationToken(account.id);
                res.status(200).json({ token: token, account: account });
            } else {
                console.log("Conta não encontrada.")
                res.status(400).json({ error: "Não encontramos uma conta com o e-mail informado." });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Não foi possível autenticar a conta." });
        }
    });

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});
