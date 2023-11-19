import Image from "next/image";

// Styling
import styles from "./styles.module.css";

// Icons
import EmailIcon from "@/public/icons/email.svg";

import DataIcon from "@/public/icons/guestStatus/data.svg";
import PendingIcon from "@/public/icons/guestStatus/pending.svg";
import VisualizedIcon from "@/public/icons/view.svg";
import ConfirmedIcon from "@/public/icons/guestStatus/confirmed.svg";

// Components
import ShareEventToGuest from "./actions/Share";
import ResendEmailToGuest from "./actions/ResendEmail";
import EditGuest from "./actions/Edit";
import DeleteGuest from "./actions/Delete";

// Types
import type { Guest } from "@prisma/client";
import type { Event } from "@prisma/client";
import type { ToastDynamicProps } from "components/_ui/Toast";

interface Props {
	guest: Omit<Guest, "event">;
	event: Omit<Event, "createdAt">;
	setToastVisible: React.Dispatch<React.SetStateAction<ToastDynamicProps>>;
}

export default function GuestCard({ guest, event, setToastVisible }: Props) {
	return (
		<div className={styles.guestCard}>
			<header>
				<div className={styles.iconAndLabel}>
					{guest.image_url && (
						<Image
							className={`${styles.image} aspect-square`}
							src={guest.image_url}
							alt="Guest image."
							height={28}
							width={28}
						/>
					)}
					<h6>{guest.name}</h6>
				</div>
				<div className={styles.actions}>
					<ShareEventToGuest
						event={{
							inviteCode: event.inviteCode,
						}}
						guest={{
							id: guest.id,
							name: guest.name,
						}}
					/>
					{event.status === "DIVULGED" &&
						guest.status === "CONFIRMED" && (
							<ResendEmailToGuest
								event={event}
								guest={guest}
								setToastVisible={setToastVisible}
							/>
						)}
					{event.status === "PENDING" && (
						<>
							<EditGuest
								guest={guest}
								setToastVisible={setToastVisible}
							/>
							<DeleteGuest
								guestId={guest.id}
								setToastVisible={setToastVisible}
							/>
						</>
					)}
				</div>
			</header>
			<footer>
				<div className={styles.iconAndLabel}>
					{guest.status === "CONFIRMED" &&
					event.status !== "DIVULGED" ? (
						<>
							<DataIcon width={16} height={16} />
							<p>Dados Confirmados</p>
						</>
					) : guest.status === "VISUALIZED" ? (
						<>
							<ConfirmedIcon width={16} height={16} />
							<p>Visualizado</p>
						</>
					) : event.status === "DIVULGED" ? (
						<>
							<VisualizedIcon
								width={16}
								height={16}
								fill={`var(--neutral)`}
							/>
							<p>Visualização pendente...</p>
						</>
					) : (
						<>
							<PendingIcon width={16} height={16} />
							<p>Aguardando convidado...</p>
						</>
					)}
				</div>

				{guest.status !== "PENDING" && (
					<>
						{/* <div className="divisor vertical" /> */}
						<div className={styles.iconAndLabel}>
							<EmailIcon />
							<p>
								{guest.email
									? guest.email
									: "[e-mail pendente]"}
							</p>
						</div>
					</>
				)}
			</footer>
		</div>
	);
}
