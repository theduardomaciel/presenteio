import Image from "next/image";
import { notFound } from "next/navigation";

// Styling
import dashboardStyles from "../dashboard.module.css";
import styles from "./styles.module.css";

// Components
import EventEdit from "@/dashboard/components/Event/EventNameEdit";
import DashboardHeader from "@/dashboard/components/Header";
import Overlay from "@/dashboard/components/Overlay";
import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import ButtonsHolder from "./subcomponents/ButtonsHolder";
import GuestCard from "app/dashboard/[eventId]/subcomponents/GuestCard";
import EmptyGuests from "@/dashboard/components/Guest/EmptyGuests";
import AddGuest from "./subcomponents/AddGuest";
import InviteLink from "./subcomponents/InviteLink";
import LandingFooter from "components/Landing/Footer/Footer";

// Assets
import LinkIcon from "@/public/icons/link.svg";
import BackgroundPattern from "@/public/images/background_pattern.png";

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
		<>
			<div className={dashboardStyles.container}>
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
					<DashboardSectionHeader title="Participantes">
						{event.status !== "DIVULGED" && (
							<AddGuest
								eventId={event.id}
								style={{
									backgroundColor: "transparent",
									color: "var(--primary-01)",
								}}
							/>
						)}
					</DashboardSectionHeader>
					<div
						className={`${styles.guestsHolder} scroll ${
							event.guests && event.guests.length === 0
								? styles.empty
								: ""
						}`}
					>
						{event.guests && event.guests.length > 0 ? (
							event.guests.map((guest, index) => {
								return (
									<GuestCard
										key={index}
										guest={guest}
										event={rest}
									/>
								);
							})
						) : (
							<EmptyGuests
								label={`Nenhum convidado foi adicionado ao evento até o momento.\nEnvie o convite para que novos usuários possam entrar!`}
							/>
						)}
					</div>
					<ButtonsHolder event={rest} />
				</div>
			</div>
			<LandingFooter className="!px-dashboard-wrapper" />
		</>
	);
}
