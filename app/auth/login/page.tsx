'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import AuthModal, { Section } from '../../../components/AuthModal';

// Stylesheets
import styles from '../auth.module.css';
import Landing from '../../page';

// Components
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { GoogleButton } from '../register/page';

export default function Register() {
    const search = useSearchParams().get('animate');
    const isAuth = search && search === "true";

    useEffect(() => {
        if (isAuth) {
            setTimeout(() => {
                const root = document.getElementById("root");
                if (root) {
                    root.classList.add('hide');
                }
                setTimeout(() => {
                    if (root) {
                        root.remove();
                    }
                }, 1000);
            }, 500);
        }
    }, [])

    const [actualSection, direction] = [0, 1];

    const Section0 = {
        title: "Log in",
        description: "Faça o login em sua conta para administrar os seus eventos.",
        children: <div className={styles.section1}>
            <GoogleButton />
            <div className={styles.outro}>
                <div className={styles.divisor} />
                <p>ou</p>
                <div className={styles.divisor} />
            </div>
            <Input label='E-mail' name='email' type={"email"} maxLength={35} required />
            <Input label='Senha' name='password' id='passwordInput' type={"password"} minLength={10} maxLength={30} required />
            <Button label='Logar' isDisabled={true} style={{ width: "100%", paddingBlock: "1rem" }} />
        </div>,
        footer: <p className={styles.footer}>Não tem uma conta? <Link href={`/auth/register`} style={{ fontWeight: "bold" }}>Criar uma conta</Link></p>
    } as Section;

    return (
        <div className={styles.pageHolder}>
            <AuthModal sections={[Section0]} actualSection={actualSection} direction={direction} />
            {isAuth && <Landing />}
        </div>
    )
}
