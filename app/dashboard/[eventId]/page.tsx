import Image from "next/image";
import { notFound } from "next/navigation";

// Styling
import dashboardStyles from "../dashboard.module.css";
import styles from "./styles.module.css";

// Assets
import LinkIcon from "@/public/icons/link.svg";
import BackgroundPattern from "@/public/images/background_pattern.png";

// Components
import DashboardHeader from "@/dashboard/components/Header";
import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import Overlay from "@/dashboard/components/Overlay";

import InviteLink from "./subcomponents/InviteLink";
import EventEdit from "@/dashboard/components/Event/EventNameEdit";
import ButtonsHolder from "./subcomponents/ButtonsHolder";

import GuestAdd from "./subcomponents/GuestAdd";
import GuestsHolder from "./subcomponents/GuestsHolder";

// Utils
import { getEvent } from "lib/getEvents";

export default async function EventPage({
	params,
}: {
	params: {
		eventId: string;
	};
}) {
	const event = await getEvent(params.eventId);

	if (!event) {
		notFound();
	}

	const { createdAt, ...rest } = event;

	return (
		<div className={`${dashboardStyles.container} min-h-screen`}>
			<DashboardHeader>
				<EventEdit event={rest} />
			</DashboardHeader>
			<div className={dashboardStyles.content}>
				<div className={styles.section1}>
					<div className={styles.info}>
						<div className={styles.iconHolder}>
							<LinkIcon />
							<h6>Link de Convite</h6>
						</div>
						{event.allowInvite ? (
							<InviteLink inviteCode={event.inviteCode} />
						) : (
							<p className="cursor-not-allowed">
								Convites desativados neste evento
							</p>
						)}
					</div>
					{event.image_url ? (
						<Image
							src={event.image_url}
							className={"imageContain"}
							fill
							sizes="100%"
							alt="Event background image"
						/>
					) : (
						<div
							className={"imagePlaceholder"}
							style={{
								backgroundImage: `url(${BackgroundPattern.src})`,
							}}
						/>
					)}
					<Overlay />
				</div>
				<ButtonsHolder event={rest} />

				<DashboardSectionHeader title="Participantes">
					{event.status !== "DIVULGED" && (
						<GuestAdd
							eventId={event.id}
							className="bg-transparent pr-0 text-primary-01 border-none hover:text-primary-02 hover:scale-105"
							aria-disabled={event.guests.length >= 30}
						/>
					)}
				</DashboardSectionHeader>
				<GuestsHolder event={rest} />
			</div>
		</div>
	);
}
