import Link from "next/link";
import Image from "next/image";

import styles from "app/error.module.css";

// Assets
import Logo from "@/public/logo_gradient.svg";
import Background from "@/public/images/background.png";

// Components
import Button from "components/_ui/Button";

export default function TermsOfService() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Logo className={styles.logo} block height={35} />
				<h1>{`Não se preocupe, nenhum dado desnecessário é coletado.`}</h1>
				<p>
					Além de nome e e-mail, intrinsecamente necessários para a
					criação de uma conta, nenhum outro dado pessoal seu é
					coletado sem consentimento. <br /> <br /> No futuro, apenas
					dados de uso do site serão coletados, como por exemplo, o
					número de visitas em uma página, ou o número de cliques em
					um botão. <br /> Esses dados são coletados para que possamos
					melhorar a experiência de uso do site, e não são
					compartilhados com terceiros.
					<br />
				</p>
				<Link href={`/`}>
					<Button>Voltar para o início</Button>
				</Link>
				<div className="divisor" />
			</div>
			<Image src={Background} style={{ zIndex: -1 }} fill alt="" />
		</div>
	);
}
