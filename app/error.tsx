"use client";
import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import styles from "./error.module.css";

// Assets
import Logo from "@/public/logo_gradient.svg";
import Background from "@/public/images/background.png";

// Components
import Button from "components/_ui/Button";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Logo className={styles.logo} height={35} />
				<h1>{`Eita! Parece que algo deu errado :(`}</h1>
				<p>
					Caso o problema persista, envie uma captura de tela do erro
					descrito abaixo para <br />
					<Link href={`mailto:app.presenteio@gmail.com`}>
						app.presenteio@gmail.com
					</Link>
				</p>
				<div className={styles.error}>
					<p className={styles.title}>
						<strong>{error.name}</strong>
					</p>
					<p>{error.message}</p>
				</div>
				<Link href={`/`}>
					<Button onClick={() => reset()}>
						Voltar para o início
					</Button>
				</Link>
				<div className="divisor" />
			</div>
			<Image src={Background} style={{ zIndex: -1 }} fill alt="" />
		</div>
	);
}
