import { cache } from 'react';
import 'server-only';

import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

import prisma from '../lib/prisma';

export const preload = () => {
    void getEvents();
}

export const getEvents = cache(async () => {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');

    if (!token) return;

    try {
        const response = verify(token?.value as string, process.env.JWT_SECRET_KEY as string) as { data: string }
        if (response) {
            const events = await prisma.event.findMany({
                where: {
                    accountId: response.data as string
                },
                include: {
                    guests: true,
                    host: true
                }
            });

            return events;
        }
    } catch (error) {

    }
});