import { notFound } from "next/navigation";

// Stylesheets
import styles from "./reveal.module.css";

// Components
import RevealContent from "./Content";

import { getEventFromInviteCode } from "@/utils/getEvents";
import { getGuest } from "@/utils/getGuest";

// Types
import { InviteProps } from "../page";
import type { Guest } from "@prisma/client";
import type { Event } from "@prisma/client";

export default async function Reveal({ params, searchParams }: InviteProps) {
	const event = await getEventFromInviteCode(params?.inviteCode as string);
	const guest = await getGuest(searchParams?.guest as string);

	if (!guest || event?.status !== "DIVULGED" || !guest.correspondingGuest) {
		notFound();
	}

	return (
		<div className={styles.container}>
			<div className={styles.gradient} />
			<RevealContent
				guestId={guest.id}
				guestsImages={event.guests.map((guest) => guest.image_url)}
				correspondingGuest={guest.correspondingGuest}
				eventProps={{
					type: event.type,
					name: event.name,
					prices:
						event.minPrice || event.maxPrice
							? {
									min: event.minPrice || undefined,
									max: event.maxPrice || undefined,
							  }
							: undefined,
				}}
			/>
			<div className={`${styles.gradient} ${styles.fromRight}`} />
		</div>
	);
}
