"use client";
import { useEffect } from "react";

import styles from "./title.module.css";

const TITLES = [
	"Amigo Secreto",
	"Sorteio Social",
	"Amigo Oculto",
	"Inimigo Oculto",
	"Amigo Doce",
];

export default function LandingTitle() {
	const getRandomTitle = () =>
		TITLES[Math.floor(Math.random() * TITLES.length)];

	useEffect(() => {
		const title2 = document.querySelector(
			`.${styles.title2}`
		) as HTMLTitleElement;
		if (title2) {
			title2.innerText = getRandomTitle();
			title2.addEventListener("animationiteration", () => {
				title2.innerText = getRandomTitle();
			});
		}
	}, []);

	return (
		<div className={styles.titleFrame}>
			<h1 className={styles.title1}>Evento Especial</h1>
			<h1 className={styles.title2}>Sorteio</h1>
		</div>
	);
}
