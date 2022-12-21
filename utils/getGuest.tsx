import { cache } from 'react';
import 'server-only';

import prisma from '../lib/prisma';

export const preload = (id: string) => {
    void getGuest(id);
}

export const getGuest = cache(async (id: string) => {
    if (!id) return null;

    try {
        const guest = await prisma.guest.findUnique({
            where: {
                id: id
            },
            include: {
                event: false,
                chosenGuest: true
            }
        });
        return guest;
    } catch (error) {
        console.log(error)
    }
});