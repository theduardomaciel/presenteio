import Image from 'next/image';
import Link from 'next/link';

import styles from 'app/error.module.css';

// Assets
import Logo from "@public/logo.svg";
import Background from "@public/images/background.png";

// Components
import Button from 'components/Button';

export default function Error() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Logo height={35} />
                <h1>Eita! Parece que esse convite não está funcionando mais!</h1>
                <p>Por favor, contate o anfitrião caso isso seja um engano.</p>
                <Link href={`/`}>
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
