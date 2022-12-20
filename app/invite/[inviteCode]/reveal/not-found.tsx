'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import styles from 'app/error.module.css';

// Assets
import Logo from "@public/logo.svg";
import Background from "@public/images/background.png";

// Components
import Button from 'components/Button';

export default function NotFound() {
    const pathname = usePathname();
    const guest = useSearchParams().get('guest');

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Logo />
                <h1>Eita! Parece que você está um pouco adiantado!</h1>
                <p>Nem todos os participantes já foram confirmados, por isso, o sorteio ainda não foi realizado. <br /> <br />
                    <strong>Não se preocupe pois você receberá um e-mail assim que o sorteio for realizado.</strong>
                </p>
                <Link href={`/invite/${pathname?.split(`/`)[2]}?guest=${guest}`}>
                    <Button>
                        Voltar para o início
                    </Button>
                </Link>
                <div className='divisor' />
            </div>
            <Image src={Background} style={{ zIndex: -1 }} fill alt='' />
        </div>
    )
}
