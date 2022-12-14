'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import axios, { AxiosError, AxiosResponse } from 'axios';

// Components
import AuthModal, { Section } from '../../../components/MultipleModal';
import GoogleButton from '../google/GoogleButton';

// Stylesheets
import styles from '../auth.module.css';
import Landing from '../../landing';

// Components
import Button from '../../../components/Button';
import Input from '../../../components/Input';

import { setCookie } from "../../../utils/cookies";
import Account from '../../../types/Account';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

interface AccountData {
    email: string;
    password: string;
}

export default function Login() {
    const isAuth = useSearchParams().get('animate') === "true";
    const theme = useSearchParams().get('theme');

    const router = useRouter();

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

    const [isLoading, setIsLoading] = useState<boolean | string>(false);
    const [actualSection, direction] = ['login', 1];

    const Section0 = {
        title: "Log in",
        hideVisibility: {
            background: true,
        },
        description: "Faça o login em sua conta para administrar os seus eventos.",
        children: <form onSubmit={handleSubmit} className={styles.section1}>
            <GoogleButton onClick={() => login()} isLoading={isLoading === true} />
            <div className={styles.outro}>
                <div className={styles.divisor} />
                <p>ou</p>
                <div className={styles.divisor} />
            </div>
            <Input label='E-mail' name='email' type={"email"} required />
            <Input errorMessage={typeof isLoading === "string" ? isLoading : undefined} label='Senha' name='password' id='passwordInput' type={"password"} required />
            <Button isLoading={isLoading === true} style={{ width: "100%", paddingBlock: "1rem" }}>
                Logar
            </Button>
        </form>,
        footer: <div className='modalFooter'><p>Não tem uma conta? <Link href={`/auth/register`} style={{ fontWeight: "bold" }}>Criar uma conta</Link></p></div>
    } as Section;

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            setIsLoading(true)
            getAccountFromGoogle(tokenResponse);
        },
        onError: errorResponse => console.log(errorResponse.error)
    });

    async function getAccountFromGoogle(tokenResponse: TokenResponse) {
        try {
            const response = await axios.post('/api/auth/login', { access_token: tokenResponse.access_token });
            const data = response.data as { token: string, account: Account };

            if (response.status === 200) {
                await setCookie("presenteio.token", data.token, 90)
                router.push(`/dashboard`)
            }
        } catch (error) {
            const err = error as AxiosError & { response: AxiosResponse<{ error: string }> };
            setIsLoading(err.response?.data.error as string)
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evitar que a página seja recarregada
        setIsLoading(true)
        console.log("Checando credenciais...")

        const formData = new FormData(event.currentTarget);
        const accountData = Object.fromEntries(formData.entries()) as unknown as AccountData;
        const { email, password } = accountData;

        try {
            const response = await axios.post('/api/auth/login', { email: email, password: password });
            const data = response.data as { token: string, account: Account };

            if (response.status === 200) {
                await setCookie("presenteio.token", data.token, 90)
                router.push(`/dashboard`)
            }
        } catch (error) {
            const err = error as AxiosError & { response: AxiosResponse<{ error: string }> };
            setIsLoading(err.response?.data.error as string)
        }
    }

    return (
        <div className={styles.pageHolder}>
            <AuthModal initial={isAuth ? true : false} sections={{ 'login': Section0 }} actualSection={actualSection} direction={direction} />
            {isAuth && <Landing hideBackground theme={theme as string} />}
        </div>
    )
}
