'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { signIn } from "next-auth/react";

// Components
import AuthModal, { Section } from '../../../components/AuthModal';

// Stylesheets
import styles from '../auth.module.css';
import Landing from '../../page';

// Components
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { GoogleButton } from '../register/page';

interface AccountData {
    email: string;
    password: string;
}

export default function Login() {
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

    const [isLoading, setIsLoading] = useState(false);
    const [actualSection, direction] = [0, 1];

    const Section0 = {
        title: "Log in",
        description: "Faça o login em sua conta para administrar os seus eventos.",
        children: <form onSubmit={handleSubmit} className={styles.section1}>
            <GoogleButton />
            <div className={styles.outro}>
                <div className={styles.divisor} />
                <p>ou</p>
                <div className={styles.divisor} />
            </div>
            <Input label='E-mail' name='email' type={"email"} maxLength={35} required />
            <Input label='Senha' name='password' id='passwordInput' type={"password"} minLength={10} maxLength={30} required />
            <Button isLoading={isLoading} label='Logar' isDisabled={true} style={{ width: "100%", paddingBlock: "1rem" }} />
        </form>,
        footer: <p className={styles.footer}>Não tem uma conta? <Link href={`/auth/register`} style={{ fontWeight: "bold" }}>Criar uma conta</Link></p>
    } as Section;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evitar que a página seja recarregada
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);
        const accountData = Object.fromEntries(formData.entries()) as unknown as AccountData;
        const { email, password } = accountData;

        const response = await signIn('credentials', { email: email, password: password, redirect: false })
        setIsLoading(false)

        console.log(response)
    }

    return (
        <div className={styles.pageHolder}>
            <AuthModal sections={[Section0]} actualSection={actualSection} direction={direction} />
            {isAuth && <Landing hideBackground />}
        </div>
    )
}
