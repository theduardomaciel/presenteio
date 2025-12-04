import { notFound, redirect } from "next/navigation";

// Stylesheets
import styles from "./reveal.module.css";

// Components
import RevealContent from "./Content";

import { getEventFromInviteCode } from "lib/api/getEvents";
import { getGuest } from "lib/api/getGuest";

// Types
import type { InviteProps } from "../page";

export default async function Reveal(props: InviteProps) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const event = await getEventFromInviteCode(params?.inviteCode!);
	const guest = await getGuest(undefined, searchParams?.guestHash);

	if (!guest || !guest.correspondingGuest) {
		console.log("Guest not found");
		notFound();
		return;
	}

	// If the event is not divulged, redirect to the invite page
	if (!guest ||
		event?.status !== "DIVULGED"
	) {
		notFound();
	}

	// If the guest is pending, redirect to the invite page for data confirmation
	if (guest?.status === "PENDING") {
		redirect(`/invite/${params?.inviteCode}?guestHash=${guest.customHash}`);
	}

	// If the guest has already visualized his corresponding guest, redirect to the invite page
	if (guest?.status === "VISUALIZED" && !searchParams?.ignoreRedirect) {
		redirect(`/invite/${params?.inviteCode}?guestHash=${guest.customHash}`);
	}

	const guestImages = event.guests
		.map((guest) => guest.image_url)
		.filter((image) => image !== null) as string[];

	return (
		<div className={styles.container}>
			<div className={styles.gradient} />
			<RevealContent
				guestId={guest.id}
				guestsImages={guestImages}
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
