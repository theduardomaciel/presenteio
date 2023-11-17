import Link from "next/link";
import Image from "next/image";

import styles from "../error.module.css";

// Assets
import Logo from "@/public/logo_gradient.svg";
import Background from "@/public/images/background.png";

// Components
import Button from "components/_ui/Button";

export default function TermsOfService() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Logo height={35} />
				<h1>{`Não se preocupe, você pode usar o presenteio livremente.`}</h1>
				<p>
					No entanto, não endossamos ou garantimos a adequação,
					confiabilidade ou precisão do presenteio para qualquer
					finalidade específica. <br /> Ao aceitar e utilizar o
					presenteio, você concorda em isentar-nos de qualquer
					responsabilidade por danos diretos, indiretos, incidentais,
					consequenciais ou especiais que possam surgir do uso ou
					incapacidade de usar o presenteio. <br /> Além disso,
					compromete-se a não realizar atividades que violem qualquer
					lei aplicável durante o uso do presenteio. <br />{" "}
					Reservamo-nos o direito de modificar, suspender ou encerrar
					o presenteio a qualquer momento, sem aviso prévio. <br /> Ao
					continuar a usar o presenteio após quaisquer modificações,
					você concorda em aceitar e ficar vinculado aos termos
					atualizados. Este presenteio é fornecido "no estado em que
					se encontra", sem garantias de qualquer tipo, expressas ou
					implícitas. <br /> O uso do presenteio é por sua conta e
					risco.
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
