import Link from 'next/link';
import Image from 'next/image';

// Stylesheets
import styles from './landing.module.css'

// Assets
import Logo from "../public/logo.svg";
import Gifts from "../public/images/gifts.png";
import background from "../public/images/background.png";

// Icons
import Arrow_right_alt from "../public/icons/arrow_right_alt.svg";

// Components
import Button from '../components/Button';
import TypewrittenText from '../components/TypewrittenText';
import Hint from '../components/Hint';

const subtitles = ['sua família', 'seu trabalho', 'seu grupo de amigos'];

interface Props {
    hideBackground?: boolean;
}

function Landing({ hideBackground }: Props) {
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
                    <div className={styles.titleFrame}>
                        <h1>Amigo Secreto</h1>
                        <h1>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</h1>
                    </div>
                    <p>para <span style={{ fontWeight: "bold" }}><TypewrittenText subtitles={subtitles} /></span></p>
                    <Link href={{
                        pathname: `/auth/register`,
                        query: { animate: true }
                    }} >
                        <Button
                            label='Criar minha conta'
                            icon={<Arrow_right_alt width={`2.4rem`} height={`2.4rem`} />}
                            iconProps={{ position: "right", animate: "position" }}
                        />
                    </Link>
                </div>
            </main>

            <section>
                <Hint
                    style={{ position: "absolute", bottom: "8vh", left: "50%", transform: "translateX(-50%)" }}
                    hint={<p style={{ color: "var(--primary-02)" }}>Este projeto encontra-se em <strong>acesso antecipado</strong>, portanto, bugs e comportamentos inesperados devem ser esperados.</p>}
                />
            </section>

            <footer>
                <Logo className={styles.footerLogo} />
                <p>feito com ❤️ por <Link style={{ cursor: "pointer" }} target={"_blank"} href={`https://instagram.com/theduardomaciel`}>@theduardomaciel</Link></p>
            </footer>

            {
                !hideBackground && <Image src={background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
            }
        </div>
    )
}

export default Landing;