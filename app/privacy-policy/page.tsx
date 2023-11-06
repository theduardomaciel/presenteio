import Link from "next/link";
import Image from "next/image";

import styles from "../error.module.css";

// Assets
import Logo from "@/public/logo.svg";
import Background from "@/public/images/background.png";

// Components
import Button from "components/Button";

export default function TermsOfService() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Logo height={35} />
                <h1>{`Não se preocupe, ainda não somos uma empresa.`}</h1>
                <p>
                    Na verdade, sou uma pessoa só! <br />
                    Então, pode ficar despreocupado, nenhum dado pessoal (além
                    de nome e e-mail, porque não dá pra fazer uma conta sem
                    isso) é coletado ao criar uma conta na plataforma.
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
