"use client";

import Image from "next/image";

// Stylesheets
import styles from "./styles.module.css";

// Assets
import CheckIcon from "@/public/icons/check.svg";
import ChevronLeft from "@/public/icons/chevron_left.svg";
import PersonIcon from "@/public/icons/person.svg";

import useHorizontalScroll from "hooks/useHorizontalScroll";

import type { Guest } from "@prisma/client";
import { GUEST_IMAGE_PLACEHOLDER } from "@/dashboard/components/Guest/styles";
import HorizontalScroll from "components/HorizontalScroll";

export default function GuestsView({ guests }: { guests: Guest[] }) {
	const { moveScroll } = useHorizontalScroll("guestsHolder", true);

	const VisualizedFilter = () => (
		<div className={styles.visualized}>
			<CheckIcon />
		</div>
	);

	return (
		<div className={styles.container}>
			<ChevronLeft
				onClick={() => moveScroll(-25)}
				style={{ cursor: "pointer", userSelect: "none" }}
			/>
			<HorizontalScroll
				className={styles.guestsHolder}
				style={{
					justifyContent:
						guests.length >= 5 ? "flex-start" : "center",
				}}
			>
				{guests.map((guest, index) => (
					<li key={index} className={styles.guest}>
						{guest.status === "VISUALIZED" && <VisualizedFilter />}
						{guest.image_url ? (
							<Image
								style={{
									zIndex: 0,
									borderRadius: "50%",
									objectFit: "cover",
									aspectRatio: "1/1",
									display: "flex",
									minWidth: 40,
									minHeight: 40,
								}}
								className="pointer-events-none select-none"
								src={guest.image_url}
								alt={guest.name}
								width={40}
								height={40}
							/>
						) : (
							<div
								style={{
									...GUEST_IMAGE_PLACEHOLDER,
									width: 40,
									height: 40,
								}}
							>
								<PersonIcon
									width={16}
									height={16}
									opacity={0.5}
								/>
							</div>
						)}
					</li>
				))}
			</HorizontalScroll>
			<ChevronLeft
				onClick={() => moveScroll(25)}
				style={{
					transform: "rotate(180deg)",
					cursor: "pointer",
					userSelect: "none",
				}}
			/>
		</div>
	);
}
