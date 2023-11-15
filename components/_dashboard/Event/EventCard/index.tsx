"use client";
import Link from "next/link";
import Image from "next/image";

import styles from "./eventCard.module.css";

// Icons
import PersonIcon from "@/public/icons/person.svg";
import SecretFriend from "@/public/icons/secret_friend.svg";

import Background from "@/public/background.svg";

import Overlay from "@/dashboard/components/Overlay";

// Types
import type { Event, Guest } from "@prisma/client";

// Types

interface Props {
	event: Omit<Event, "createdAt"> & {
		guests?: Guest[];
	};
}

export default function EventCard({ event }: Props) {
	return (
		<Link href={`/dashboard/${event.id}`} className={styles.eventCard}>
			<header>
				<div className={styles.iconAndLabel}>
					<PersonIcon width={`1.2rem`} height={`1.2rem`} />
					<p style={{ whiteSpace: "nowrap" }}>
						{event.guests ? event.guests.length : 0} participante
						{!event.guests || event.guests.length !== 1 ? "s" : ""}
					</p>
				</div>
			</header>
			<div className={styles.info}>
				<h3>{event.name}</h3>
				<div className={styles.iconAndLabel}>
					<SecretFriend />
					<p>
						{event.type === "AMIGOSECRETO"
							? "Amigo Secreto"
							: "Sorteio"}
					</p>
				</div>
			</div>
			<Overlay />
			{event.image_url ? (
				<Image
					src={event.image_url}
					className={styles.image}
					fill
					alt=""
				/>
			) : (
				<div
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "transparent",
						position: "absolute",
						top: "0",
						left: 0,
						zIndex: -1,
					}}
				>
					<Background className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
				</div>
			)}
		</Link>
	);
}
