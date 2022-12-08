import Link from 'next/link';

// Stylesheets
import styles from './landing.module.css'

// Assets
import Logo from "../public/logo.svg";

// Icons
import Arrow_right_alt from "../public/icons/arrow_right_alt.svg";

// Components
import Button from '../components/Button';
import TypewrittenText from '../components/TypewrittenText';
import Hint from '../components/Hint';

const subtitles = ['sua família', 'seu trabalho', 'seu grupo de amigos'];

export default function Landing() {
    return (
        <div id='root' className={styles.container}>
            <header>
                <Logo />
                <Link href={{
                    pathname: `/auth/login`,
                    query: { animate: true }
                }} as={`/auth/login`} >
                    Entrar
                </Link>
            </header>

            <main>
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
                    }} as={`/auth/register`} >
                        <Button
                            label='Criar minha conta'
                            icon={<Arrow_right_alt width={`2.4rem`} height={`2.4rem`} />}
                            iconProps={{ position: "right", animate: "position" }}
                        />
                    </Link>
                </div>
            </main>

            <section>
                <Hint style={{ position: "absolute", bottom: "8vh", left: "50%", transform: "translateX(-50%)" }} hint='Este projeto encontra-se em acesso antecipado, portanto, a presença de bugs e outros problemas será comum enquanto o desenvolvimento não for concluído.' />
            </section>

            <footer>
                <Logo className={styles.footerLogo} />
                <p>feito com ❤️ por <Link style={{ cursor: "pointer" }} target={"_blank"} href={`https://instagram.com/theduardomaciel`}>@theduardomaciel</Link></p>
            </footer>
        </div>
    )
}
