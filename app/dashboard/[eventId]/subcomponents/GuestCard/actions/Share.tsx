import { Fragment, useState } from "react";

// Icons
import ShareIcon from "@/public/icons/share.svg";

// Components
import EventShareModal from "@/dashboard/components/Event/ShareModal";

interface Props {
	guest: {
		id: string;
		name: string;
	};
	event: {
		inviteCode: string;
	};
}

export default function ShareEventToGuest({ guest, event }: Props) {
	const [isEventShareModalVisible, setEventShareModalVisible] =
		useState(false);

	return (
		<Fragment>
			<ShareIcon
				width={22}
				height={22}
				onClick={() => {
					setEventShareModalVisible(true);
				}}
			/>
			<EventShareModal
				isVisible={isEventShareModalVisible}
				toggleVisibility={() => setEventShareModalVisible(false)}
				link={`${
					typeof window !== "undefined"
						? window.location.origin
						: "https://presenteio.vercel.app"
				}/invite/${event.inviteCode}?guest=${guest.id}`}
				description={
					<p>
						O link abaixo é único e{" "}
						<strong>exclusivo para {guest.name}</strong> e somente
						deve ser utilizado por esse convidado. <br />
						Tenha cuidado, pois as informações pessoais do convidado
						podem ser visualizadas por qualquer um com acesso ao
						link.
					</p>
				}
			/>
		</Fragment>
	);
}
