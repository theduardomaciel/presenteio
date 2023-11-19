import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

// Styling
import styles from "./landing.module.css";

// Assets
import Gifts from "@/public/images/gifts.png";

// Icons
import Arrow_right_alt from "@/public/icons/arrow_right_alt.svg";

// Components
import Button from "components/_ui/Button";
import TypewrittenText from "components/TypewrittenText";
import LandingTitle from "../../components/Landing/Title";

const subtitles = ["sua família", "seu trabalho", "seu grupo de amigos"];

export default function LandingPage() {
	return (
		<div className={styles.landing}>
			<Image
				className={styles.imageHolder}
				width={305}
				height={374}
				src={Gifts}
				alt="Presentes vermelhos com fita amarela que forma um laço no topo."
			/>
			<div className={styles.content}>
				<div className={styles.title}>
					<p>Marque momentos com um</p>
					<LandingTitle />
					<p>
						para{" "}
						<span style={{ fontWeight: "bold" }}>
							<TypewrittenText subtitles={subtitles} />
						</span>
					</p>
				</div>
				<Link href={`/dashboard/compose`}>
					<Button
						iconProps={{ animate: "position-toRight" }}
						style={{
							fontWeight: "bold",
						}}
					>
						Criar um evento
						<Arrow_right_alt
							width={`2.4rem`}
							height={`2.4rem`}
							fill={`var(--neutral)`}
						/>
					</Button>
				</Link>

				<Link
					href={"/dashboard"}
					className="border border-primary-01 rounded-full py-1 px-4 hover:outline hover:outline-[1px] hover:outline-offset-2 hover:outline-primary-01"
				>
					<p className="text-primary-01 text-sm">Ver meus eventos</p>
				</Link>
			</div>
		</div>
	);
}
