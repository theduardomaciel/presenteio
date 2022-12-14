import Link from 'next/link';
import Image from 'next/image';

// Stylesheets
import styles from './landing.module.css'

// Assets
import Logo from "@public/logo.svg";
import Gifts from "@public/images/gifts.png";
import Background from "@public/images/background.png";
import DarkBackground from "@public/images/background_dark.png";

// Icons
import Arrow_right_alt from "@public/icons/arrow_right_alt.svg";

// Components
import Button from 'components/Button';
import TypewrittenText from 'components/TypewrittenText';
import Hint from 'components/Hint';
import LandingTitle from './Title';

const subtitles = ['sua família', 'seu trabalho', 'seu grupo de amigos'];

interface Props {
    hideBackground?: boolean;
    theme?: string;
}

function Landing({ hideBackground, theme }: Props) {
    return (
        <div id='root' className={styles.container}>
            <header>
                <Logo />
                <Link href={{
                    pathname: `/auth/login`,
                    query: { animate: true }
                }} >
                    Entrar
                </Link>
            </header>

            <main>
                <Image
                    className={styles.imageHolder}
                    width={305}
                    height={374}
                    src={Gifts}
                    alt="Presentes vermelhos com fita amarela que forma um laço no topo."
                />
                <div className={styles.content}>
                    <p>Marque momentos com um</p>
                    <LandingTitle />
                    <p>para <span style={{ fontWeight: "bold" }}><TypewrittenText subtitles={subtitles} /></span></p>
                    <Link href={{
                        pathname: `/auth/register`,
                        query: { animate: true }
                    }} >
                        <Button iconProps={{ animate: "position-toRight" }} >
                            Criar minha conta
                            <Arrow_right_alt width={`2.4rem`} height={`2.4rem`} fill={`var(--neutral)`} />
                        </Button>
                    </Link>
                </div>
            </main>

            <section className={styles.hint}>
                <Hint hint={<p style={{ color: "var(--primary-02)" }}>Este projeto encontra-se em <strong>acesso antecipado</strong>, portanto, bugs e comportamentos inesperados devem ser esperados.</p>} />
            </section>

            <footer>
                <Logo className={styles.footerLogo} />
                <p>feito com ❤️ por <Link style={{ cursor: "pointer" }} target={"_blank"} href={`https://instagram.com/theduardomaciel`}>@theduardomaciel</Link></p>
            </footer>
            {
                !hideBackground &&
                <Image src={theme && theme === "dark" ? DarkBackground : Background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
            }
        </div>
    )
}

export default Landing;