"use client";

// Styling
import styles from "../styles.module.css";

// Components
import GuestCard from "./GuestCard";
import EmptyGuests from "@/dashboard/components/Guest/EmptyGuests";
import DashboardToast, { ToastDynamicProps } from "components/_ui/Toast";

// Types
import type { Event, Guest } from "@prisma/client";
import { useState } from "react";

interface Props {
	event: Omit<Event, "createdAt"> & { guests: Guest[] };
}

export default function GuestsHolder({ event }: Props) {
	const [[isToastVisible, toastProps], setToastVisible] =
		useState<ToastDynamicProps>([false]);

	return (
		<>
			<div
				className={`${styles.guestsHolder} scroll ${
					event.guests && event.guests.length === 0
						? styles.empty
						: ""
				}`}
			>
				{event.guests && event.guests.length > 0 ? (
					event.guests
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((guest, index) => {
							return (
								<GuestCard
									key={index}
									guest={guest}
									event={event}
									setToastVisible={setToastVisible}
								/>
							);
						})
				) : (
					<EmptyGuests
						label={`Nenhum convidado foi adicionado ao evento até o momento.\nEnvie o convite para que novos usuários possam entrar!`}
					/>
				)}
			</div>
			<DashboardToast
				isOpened={isToastVisible}
				setDynamicOpened={setToastVisible}
				toastProps={toastProps}
			/>
		</>
	);
}
