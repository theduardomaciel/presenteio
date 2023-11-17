import Image from "next/image";
import Link from "next/link";

import styles from "./error.module.css";

// Assets
import Logo from "@/public/logo_gradient.svg";
import Background from "@/public/images/background.png";

// Components
import Button from "components/_ui/Button";

export default function NotFound({}) {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<Logo height={35} />
				<div className="flex flex-col items-center justify-center gap-2">
					<h1>404...</h1>
					<h2>{`Ops! Parece que você se perdeu no caminho da festa. 🎉`}</h2>
				</div>
				<p>
					Nossa equipe de desenvolvedores está trabalhando duro para
					garantir que todos os presentes estejam no lugar certo, mas
					parece que algo deu errado. <br /> Enquanto isso, sugerimos
					voltar à página inicial e começar a festa novamente.
				</p>
				<Link
					href={`/`}
					className="flex items-center justify-center w-full"
				>
					<Button className="w-3/4 p-2">Voltar para o início</Button>
				</Link>
				<div className="divisor" />
			</div>
			<Image src={Background} style={{ zIndex: -1 }} fill alt="" />
		</div>
	);
}
