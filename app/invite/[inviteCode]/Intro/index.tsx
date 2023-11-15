import Image from "next/image";

// Components
import ParticipateButton from "./ParticipateButton";

// Stylesheet
import styles from "./intro.module.css";

// Assets
import Gifts from "@/public/images/gifts.png";
import Gift from "@/public/images/gift.png";

import LogoutIcon from "@/public/icons/logout.svg";

import type { Guest } from "@prisma/client";
import type { Event } from "@prisma/client";

import getWordGenre from "@/utils/wordGenre";

interface Props {
	guest?: Guest;
	event: Event;
}

function getGreetings() {
	const date = new Date();
	const hour = date.getHours();

	if (hour >= 0 && hour < 12) {
		return "Bom dia";
	} else if (hour >= 12 && hour < 18) {
		return "Boa tarde";
	} else {
		return "Boa noite";
	}
}

export default function Intro({ guest, event }: Props) {
	const { createdAt, ...rest } = event;
	return (
		<>
			{guest && (
				<header className={styles.header}>
					<h6>
						{getGreetings()}, <strong>{guest.name}</strong>!
					</h6>
					{/* <button className="flex flex-row items-center justify-end gap-3 text-primary-02 font-sans text-sm hover:scale-[101%] hover:outline outline-[0.5px] outline-primary-01 outline-offset-[8px] rounded-[0.15px] transition-all duration-100">
						Não sou esta pessoa, sair{" "}
						<span>
							<LogoutIcon width={18} height={18} />
						</span>
					</button> */}
				</header>
			)}
			<div className={styles.content}>
				<div className={styles.title}>
					<div className={styles.titleContent}>
						<h3>Chegou a hora do</h3>
						<h1>
							{event.type === "AMIGOSECRETO"
								? "Amigo Secreto"
								: "Sorteio"}
						</h1>
						<h3>
							d{getWordGenre(event.name)} {event.name}
						</h3>
					</div>

					<ParticipateButton guest={guest} event={rest} />
				</div>

				<Image
					className={styles.giftsImage}
					width={305}
					height={374}
					src={Gifts}
					priority
					draggable={false}
					alt="Vários presentes vermelhos com fita amarela que forma um laço no topo."
				/>
				<Image
					className={styles.giftImage}
					width={155}
					height={155}
					src={Gift}
					priority
					draggable={false}
					alt="Presente vermelho único com fita amarela que forma um laço no topo."
				/>
			</div>
		</>
	);
}
