import { cache } from 'react';
import 'server-only';

import prisma from '../lib/prisma';

export const preload = (id: string) => {
    void getGuest(id);
}

export const getGuest = cache(async (id: string, updateStatus?: boolean) => {
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
        if (updateStatus && guest?.status === "CONFIRMED") {
            await prisma.guest.update({
                where: {
                    id: id
                },
                data: {
                    status: "VISUALIZED"
                },
                include: {
                    event: false,
                    chosenGuest: true
                }
            });
            console.log("Status updated.")
        }
        return guest;
    } catch (error) {
        console.log(error)
    }
});