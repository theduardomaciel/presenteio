import { createRouter } from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

import { verify } from "jsonwebtoken";

import prisma from "../../../../lib/prisma";
import { EventStatus, Guest } from "@prisma/client";
import { sendEmailToGuest } from "pages/api/emails/sendEmail";

export type NextApiRequestWithBodyData = NextApiRequest & { file: any };
const router = createRouter<NextApiRequestWithBodyData, NextApiResponse>();

router
    .post(async (req, res) => {
        const { id } = req.body;

        if (!id) {
            return res.status(400).end("Bad request. The id was not provided.");
        }

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(id as string),
            },
            include: {
                guests: true,
            }
        });

        if (!event) {
            return res.status(404).end("Event not found");
        }

        const eventGuests = event.guests as Guest[];

        let guestsAlreadyRaffledIds: string[] = [];
        const isAlreadyRaffled = (id: string) => guestsAlreadyRaffledIds.includes(id);

        function getRandomRaffle(guest: Guest) {
            const availableGuests = eventGuests.filter((iterationGuest) => iterationGuest.id !== guest.id && isAlreadyRaffled(iterationGuest.id) === false);
            const randomGuest = availableGuests[Math.floor(Math.random() * availableGuests.length)];
            guestsAlreadyRaffledIds.push(randomGuest.id);
            return randomGuest
        }

        const guests = await Promise.all(await eventGuests.map((guest) => {
            const guestRaffle = getRandomRaffle(guest);
            return { ...guest, chosenGuest: guestRaffle }
        }));

        //console.log(guests.map(guest => `${guest.name} -> ${guest.chosenGuest.name}`))

        const guestsToUpdate = guests.map((guest) => {
            return {
                where: {
                    id: guest.id
                },
                data: {
                    chosenGuest: {
                        connect: {
                            id: guest.chosenGuest.id
                        }
                    }
                }
            }
        })

        async function sendAllEmails() {
            await Promise.all(guests.map(async (guest) => {
                if (guest.email) {
                    console.log(`Sending email to ${guest.email}`);
                    await sendEmailToGuest(guest.email as string, {
                        guestName: guest.name,
                        guestId: guest.id,
                        eventName: event?.name,
                        eventType: event?.type,
                        eventInviteCode: event?.inviteCode,
                    });
                }
            }))
        }

        try {
            await sendAllEmails()
            const updatedEvent = await prisma.event.update({
                where: {
                    id: parseInt(id as string),
                },
                data: {
                    status: EventStatus.DIVULGATED,
                    guests: {
                        update: guestsToUpdate && guestsToUpdate.length > 0 ? guestsToUpdate : undefined
                    },
                }
            }) as any;
            console.log(`Os convidados do evento ${updatedEvent.name} foram sorteados com sucesso!`)
            return res.status(200).json(updatedEvent);
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