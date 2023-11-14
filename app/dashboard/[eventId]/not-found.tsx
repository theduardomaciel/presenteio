import Image from "next/image";
import Link from "next/link";

import styles from "app/error.module.css";

// Assets
import Logo from "@/public/logo.svg";
import Background from "@/public/images/background.png";

// Components
import Button from "components/_ui/Button";

export default function Error() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Logo />
				<h1>Eita! Nos deparamos com um 404.</h1>
				<p>
					Parece que esse esse evento não existe. Caso isso seja um
					erro, entre em contato com o{" "}
					<a
						href="mailto:app.presenteio@gmail.com"
						style={{ fontWeight: 900, textDecoration: "underline" }}
					>
						suporte
					</a>{" "}
					para que estejamos cientes do problema!
				</p>
				<Link href={`/dashboard`}>
					<Button>Voltar para o início</Button>
				</Link>
				<div className="divisor" />
			</div>
			<Image src={Background} style={{ zIndex: -1 }} fill alt="" />
		</div>
	);
}
