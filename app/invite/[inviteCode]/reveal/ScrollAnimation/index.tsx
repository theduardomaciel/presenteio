"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { InfiniteLoopSlider, Tag } from "./InfiniteScroll";

import styles from "./styles.module.css";

// Properties
const DURATION = 10000;
const ROWS = 3;
const TAGS_PER_ROW = 10;

const random = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr: string[]) => [...arr].sort(() => 0.5 - Math.random());

const makeRepeated = (arr: string[], repeats: number) =>
	Array.from({ length: repeats }, () => arr).flat();

import type { Guest } from "@prisma/client";

interface Props {
	guestsImages: string[];
	correspondingGuest: Guest;
	eventPrices?: { min?: number; max?: number };
}

export default function ScrollAnimation({
	guestsImages,
	correspondingGuest,
	eventPrices,
}: Props) {
	const [status, setStatus] = useState<
		"animating" | "finishing" | "animated"
	>("animating");

	useEffect(() => {
		const tickAudio = new Audio(`/sounds/tick.mp3`);
		tickAudio.loop = false;
		tickAudio.volume = 0.35;
		tickAudio.play();

		const drumsAudio = new Audio(`/sounds/drums.mp3`);
		drumsAudio.loop = false;
		drumsAudio.volume = 0.35;

		const removeTimeout = setTimeout(() => {
			drumsAudio.play();

			const elements = document.querySelectorAll(`.${styles.inner}`);
			elements.forEach((element) => {
				const div = element as HTMLDivElement;
				if (div.classList.contains(styles.correspondingGuest)) return;
				div.style.opacity = "0";
			});
			const fadeTimeout = setTimeout(() => {
				const elements = document.querySelectorAll(`.${styles.image}`);
				elements.forEach((element) => {
					const div = element as HTMLDivElement;
					if (
						div.classList.contains(styles.correspondingGuest) ===
						false
					) {
						div.style.opacity = "0";
					}
				});
				setStatus("animated");

				const finishAudio = new Audio(`/sounds/congrats.mp3`);
				finishAudio.loop = false;
				finishAudio.play();

				fadeTimeout && clearTimeout(fadeTimeout);
				removeTimeout && clearTimeout(removeTimeout);
			}, 5 * 1000);
		}, DURATION);
	}, []);

	const MULTIPLY_BY = Math.floor((TAGS_PER_ROW * 2) / guestsImages.length);
	const SORTED_ARRAY = useMemo(
		() =>
			makeRepeated(shuffle(guestsImages), MULTIPLY_BY).concat([
				guestsImages[guestsImages.length - 1],
			]),
		[]
	);

	const MIDDLE_INDEX = Math.floor(SORTED_ARRAY.length / 2);

	const images = SORTED_ARRAY.map((guest, i) => (
		<Tag
			key={i.toString() + "_image"}
			additionalClass={
				i === MIDDLE_INDEX ? styles.correspondingGuest : undefined
			}
			image_url={
				i === MIDDLE_INDEX
					? correspondingGuest.image_url || undefined
					: guest
			}
			size={150}
			style={{ marginRight: 0 }}
		/>
	));

	const PRICE_MESSAGE =
		eventPrices?.min && eventPrices.max
			? `esteja entre R$${eventPrices.min} e R$${eventPrices.max}`
			: eventPrices?.min
			? `esteja, caso possível, próximo de R$${eventPrices.min}`
			: eventPrices?.max
			? `não ultrapasse R$${eventPrices.max}`
			: "";

	return (
		<AnimatePresence>
			<motion.div
				key={"scrollAnimation"}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className={styles.tagList}
			>
				{status === "animating" && (
					<InfiniteLoopSlider
						key={"firstAnimator"}
						duration={random(DURATION - 5000, DURATION + 5000)}
						reverse={0}
					>
						{shuffle(
							guestsImages.length < TAGS_PER_ROW
								? makeRepeated(guestsImages, 3)
								: guestsImages
						)
							.slice(0, TAGS_PER_ROW)
							.map((guest, i) => (
								<Tag
									key={i.toString() + "_firstAnimator"}
									image_url={guest}
									size={125}
								/>
							))}
					</InfiniteLoopSlider>
				)}

				<motion.div
					layout
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ type: "spring" }}
					className={styles.center}
				>
					{images}
				</motion.div>

				{status === "animated" && (
					<motion.div
						key={"animatorDiv"}
						className={styles.chosenReveal}
						initial={{ transform: "translateY(50%)", opacity: 0 }}
						animate={{ transform: "translateY(0%)", opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className={styles.title}>
							<h2>Seu amigo secreto é</h2>
							<h1>{correspondingGuest.name}!</h1>
						</div>
						<p>
							{(eventPrices && eventPrices.min) ||
							eventPrices?.max
								? `Para este evento, o recomendado é que o valor dos presentes ${PRICE_MESSAGE}.`
								: "Não se preocupe, você poderá ver o nome de seu amigo secreto novamente a qualquer momento."}{" "}
							<br />
							Agora é só preparar o presente e aguardar o tão
							aguardado dia do amigo secreto!
						</p>
						<div className={"divisor"} />
					</motion.div>
				)}

				{status === "animating" && (
					<InfiniteLoopSlider
						key={"secondAnimator"}
						duration={random(DURATION - 5000, DURATION + 5000)}
						reverse={0}
					>
						{shuffle(
							guestsImages.length < TAGS_PER_ROW
								? makeRepeated(guestsImages, 3)
								: guestsImages
						)
							.slice(0, TAGS_PER_ROW)
							.map((guest, i) => (
								<Tag
									key={i.toString() + "_secondAnimator"}
									image_url={guest}
									size={125}
								/>
							))}
					</InfiniteLoopSlider>
				)}
			</motion.div>
		</AnimatePresence>
	);
}
