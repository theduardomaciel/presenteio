import { cache } from 'react';
import 'server-only';

import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

import prisma from '../lib/prisma';

/* export const preload = () => {
    void getAccount();
} */

export const getAccount = cache(async (teste: string) => {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');
    if (!token) return;

    console.log('Atualizando conta...')
    try {
        const response = verify(token.value as string, process.env.JWT_SECRET_KEY as string) as { data: string }
        if (response) {
            const account = await prisma.account.findUnique({
                where: {
                    id: response.data as string
                }
            });
            return account;
        }
    } catch (error) {
        console.log(error)
    }
});