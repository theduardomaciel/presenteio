'use client';
import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';

// Components
import AuthModal, { Section } from '../../../components/MultipleModal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Hint from '../../../components/Hint';
import GoogleButton from '../google/GoogleButton';

// Stylesheets
import styles from '../auth.module.css';

const unselectedStyle = {
    padding: "2rem 2.5rem",
    gap: "2.5rem",
    justifyContent: "flex-start",
    backgroundColor: "var(--light)",
    border: "2px solid var(--primary-03)",
    width: "100%",
    borderRadius: "1rem",
}

const selectedStyle = {
    padding: "2rem 2.5rem",
    gap: "2.5rem",
    justifyContent: "flex-start",
    backgroundColor: "var(--primary-02)",
    border: "2px solid var(--primary-03)",
    width: "100%",
    borderRadius: "1rem",
}

const textSelectedStyle = {
    color: "var(--light)",
}

const textUnselectedStyle = {
    color: "var(--primary-02)",
}

// Icons
import MailLockIcon from '../../../public/icons/mail_lock.svg';
import GoogleIcon from '../../../public/icons/google.svg';
import RightIcon from '../../../public/icons/arrow_right_alt.svg';

import Landing from '../../landing';

import { setCookie } from '../../../utils/cookies';
import Account from '../../../types/Account';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

interface AccountFormData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    code?: string;
}

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const checkEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(EMAIL_REGEX);
}

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
                        root.style.display = "none";
                        // root.remove(); isso aqui MATA o Framer Motion, então não pode ser usado
                    }
                }, 1000);
            }, 500);

        }
    }, [])

    function checkCode() {
        if (accountData?.code) {
            // Check if all inputs correspond to the code character
            const inputs = document.querySelectorAll('#emailCode input');
            const codeArray = Array.from(accountData.code);

            let isCodeCorrect = true;

            inputs.forEach((input, index) => {
                const inputElement = input as HTMLInputElement;
                if (inputElement.value.toUpperCase() !== codeArray[index]) {
                    isCodeCorrect = false;
                }
            })

            if (isCodeCorrect) {
                setupAccount()
            }
        }
    }

    function onCodeInput(event: any) {
        const target = event.target as any;

        if (target) {
            const inputLength = target.value.length;
            // no código de e-mail cada quadradinho tem tamanho máximo 1;

            if (inputLength >= 1) {
                const next = target.nextElementSibling;
                if (next) {
                    next.focus();
                }
            } else if (inputLength === 0 && event.keyCode === 8) {
                const previous = target.previousElementSibling;
                if (previous) {
                    previous.focus();
                }
            }

            checkCode()
        }
    }

    function handlePaste(event: any) {
        // Stop data actually being pasted into div
        event.stopPropagation();
        event.preventDefault();

        // Get pasted data via clipboard API
        const clipboardData = event.clipboardData;
        const pastedData = clipboardData.getData('Text') as string;

        const inputs = document.querySelectorAll('#emailCode input');
        inputs.forEach((input, index) => {
            const inputElement = input as HTMLInputElement;
            inputElement.value = pastedData.slice(index, index + 1) || '';
        });

        checkCode()
    }

    const [accountData, setAccountData] = useState<AccountFormData | null>(null);

    async function setupAccount() {
        if (accountData !== null) {
            changeSection("loading", 1);

            const { name, email, password } = accountData;

            const response = await axios.post('/api/auth/register', { name: name, email: email, password: password });
            const data = response.data as { token: string, account: Account };

            if (response.status === 200) {
                try {
                    await setCookie("presenteio.token", data.token, 90)
                    if (response?.status === 200) {
                        changeSection("final", 1);
                    } else {
                        setAccountData(null)
                        changeSection("error", -1);
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                setAccountData(null)
                changeSection("error", -1);
            }
        } else {
            console.error("Não foi possível criar a conta, pois os dados não foram fornecidos.");
            changeSection("error", -1);
        }
    }

    const EMAIL_RESEND_DELAY = 90;
    const timer = useRef(EMAIL_RESEND_DELAY);
    const emailsSent = useRef(0);

    async function sendEmail(directData?: any) {
        emailsSent.current += 1;
        const data = accountData || directData;
        if (!data || !data.code) {
            console.log("Não foi possível enviar o e-mail, pois os dados não foram fornecidos.")
        } else {
            console.log("Recomeçando processo")
            const resendEmailButton = document.getElementsByClassName(styles.resendEmail)[0] as HTMLButtonElement;
            if (resendEmailButton) {
                timer.current = Math.round(EMAIL_RESEND_DELAY * Math.pow(1.5, emailsSent.current));
                resendEmailButton.disabled = true
                resendEmailButton.classList.add(styles.disabled)
            }

            const interval = setInterval(() => {
                timer.current -= 1;
                const resendEmailButton = document.getElementsByClassName(styles.resendEmail)[0] as HTMLButtonElement;
                if (resendEmailButton) {
                    resendEmailButton.textContent = `Reenviar código (${timer.current >= 60 ? Math.floor(timer.current / 60) : 0}:${timer.current % 60 < 10 ? "0" + timer.current % 60 : timer.current % 60})`;
                    if (timer.current <= 0) {
                        resendEmailButton.disabled = false;
                        resendEmailButton.textContent = `Reenviar código`;
                        resendEmailButton.classList.remove(styles.disabled)
                        clearInterval(interval)
                    }
                }
            }, 1 * 1000);

            try {
                const response = await axios.post(`/api/emails/sendEmail`, { emailProps: { code: data.code, name: data.name }, sendTo: data.email });
                if (response.status === 200) {
                    console.log("E-mail enviado com sucesso.")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    type ErrorsType = {
        [key: string]: string;
    };

    const ERRORS = {
        "auth/email-already-in-use": "O e-mail fornecido já está em uso.",
        "auth/invalid-email": "O e-mail fornecido é inválido.",
        "auth/weak-password": "A senha fornecida é muito fraca.",
        "auth/passwords-not-matching": "As senhas não coincidem.",
        "auth/not-complete-name": "O nome fornecido não é completo.",
        "auth/verification-error": "Não foi possível verificar seu e-mail com sucesso. Por favor, tente novamente.",
    } as ErrorsType;
    const [error, setError] = useState<{ error: string, input: string } | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true)

        const formData = new FormData(event.currentTarget);
        const formAccountData = Object.fromEntries(formData.entries()) as unknown as AccountFormData;

        const { name, email, password, passwordConfirm } = formAccountData;

        if (password.normalize() !== passwordConfirm.normalize()) {
            const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
            const confirmPasswordInput = document.getElementById("passwordConfirmInput") as HTMLInputElement;

            setError({ error: "auth/passwords-not-matching", input: "passwordInput" })
            passwordInput.style.outline = "2px solid var(--primary-01)";
            confirmPasswordInput.style.outline = "2px solid var(--primary-01)";

            setTimeout(() => {
                passwordInput.style.outline = "none";
                confirmPasswordInput.style.outline = "none";
                setError(null);
            }, 3000);

            setIsLoading(false)
            return;
        }

        if (checkEmail(email) === null) {
            const emailInput = document.getElementById("emailInput") as HTMLInputElement;

            setError({ error: "auth/invalid-email", input: "emailInput" })
            emailInput.style.outline = "2px solid var(--primary-01)";

            setTimeout(() => {
                setError(null);
                emailInput.style.outline = "none";
            }, 3000);

            setIsLoading(false)
            return;
        }

        if (name.split(" ").length < 2) {
            const nameInput = document.getElementById("nameInput") as HTMLInputElement;

            setError({ error: "auth/not-complete-name", input: "nameInput" })
            nameInput.style.outline = "2px solid var(--primary-01)";

            setTimeout(() => {
                setError(null);
                nameInput.style.outline = "none";
            }, 3000);

            setIsLoading(false)
            return;
        }

        axios.get(`/api/emails/checkEmail?email=${email}`)
            .then((isEmailCadastred) => {
                if (isEmailCadastred.data) {
                    const emailInput = document.getElementById("emailInput") as HTMLInputElement;

                    setError({ error: "auth/email-already-in-use", input: "emailInput" })
                    emailInput.style.outline = "2px solid var(--primary-01)";

                    /* setTimeout(() => {
                        setError(null);
                        emailInput.style.outline = "none";
                    }, 3000); */

                    setIsLoading(false)
                    changeSection("account_exists", 1);
                    return;
                } else {
                    const CONFIRMATION_CODE = Math.random().toString(36).substring(2, 7).toUpperCase();

                    formAccountData.code = CONFIRMATION_CODE;
                    setAccountData(formAccountData)

                    changeSection("email_confirm", 1);
                    sendEmail(formAccountData)
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                console.log(error)
                setError({ error: "auth/verification-error", input: "emailInput" })
                setIsLoading(false)
            })

    }

    async function createAccountFromGoogle(tokenResponse: TokenResponse) {
        try {
            const response = await axios.post(`/api/auth/register`, { access_token: tokenResponse.access_token })
            setIsLoading(false)
            console.log(response.status)
            if (response?.status === 200) {
                await setCookie("presenteio.token", response.data.token, 90)
                changeSection("final", 1);
            } else {
                changeSection("error", -1);
            }
        } catch (error: any) {
            setIsLoading(false)
            if (error.response.status === 400) {
                changeSection("account_exists", -1);
            } else {
                changeSection("error", -1);
            }
        }
    }

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            setIsLoading(true)
            createAccountFromGoogle(tokenResponse);
        },
        onError: errorResponse => console.log(errorResponse.error)
    });

    const [[actualSection, direction], setActualSection] = useState<[string, number]>(["flow_choose", 1]);
    const [selected, setSelected] = useState<number | null>(null);

    const warningStyle = { textDecoration: "underline", cursor: "pointer" }
    const TermsWarning = <p style={{ color: "var(--primary-01)" }}>Ao se cadastrar, você concorda com os <Link style={warningStyle} href={`/terms-of-service`}>Termos de Serviço</Link> e a <Link style={warningStyle} href={`/privacy-policy`}>Política de Privacidade</Link>.</p>

    const FlowChoose = {
        title: "Vamos criar sua conta",
        hideVisibility: {
            background: true,
        },
        description: "Antes de podermos criar, precisamos que você escolha como vai querer entrar na plataforma.",
        children: <div className={styles.section1}>
            <Button
                additionalClasses={`${styles.button} ${selected === 0 ? styles.selected : ""}`}
                style={selected === 0 ? selectedStyle : unselectedStyle}
                onClick={() => {
                    setSelected(0)
                }}
            >
                <GoogleIcon className={styles.optionIcon} />
                <div className={styles.buttonInfo} >
                    <h6>Entrar com o Google</h6>
                    <p style={selected === 0 ? textSelectedStyle : textUnselectedStyle}>Fique despreocupado em ter que lembrar da senha de acesso à plataforma.</p>
                </div>
            </Button>
            <Button
                additionalClasses={`${styles.button} ${selected === 1 ? styles.selected : ""}`}
                style={selected === 1 ? selectedStyle : unselectedStyle}
                onClick={() => {
                    setSelected(1)
                }}
            >
                <MailLockIcon className={styles.optionIcon} />
                <div className={styles.buttonInfo} >
                    <h6>Entrar com e-mail e senha</h6>
                    <p style={selected === 1 ? textSelectedStyle : textUnselectedStyle}>Utilize o método tradicional de autenticação. <br />
                        Você terá que lembrar de sua senha para entrar na plataforma.</p>
                </div>
            </Button>
            <Button
                onClick={() => { selected === 0 ? changeSection("google_flow", 1) : changeSection("email_flow", 1); }}
                label='Prosseguir'
                disabled={selected === null}
                style={{ width: "100%", paddingBlock: "1rem" }}
            />
        </div>,
        footer: <div className='modalFooter'><p className={styles.footer}>Já tem uma conta? <Link href={`/auth/login`} style={{ fontWeight: "bold" }}>Entrar</Link></p></div>
    } as Section;

    const GoogleFlow = {
        title: "Estamos quase lá",
        hideVisibility: {
            background: true,
        },
        description: "Agora falta muito pouco para administrar seus próprios eventos, basta entrar com sua conta Google para cadastrar-se.",
        children: <div className={styles.section1}>
            <GoogleButton isLoading={isLoading} onClick={() => login()} />
            {!isLoading && TermsWarning}
        </div>,
        footer: isLoading ? undefined : <div className='modalFooter' onClick={() => changeSection("flow_choose", -1)}>
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const EmailFlow = {
        title: "Estamos quase lá",
        hideVisibility: {
            background: true,
        },
        description: "Agora falta muito pouco para administrar seus próprios eventos, basta inserir as informações necessárias para cadastrar-se.",
        children: <form className={styles.section1} onSubmit={submitForm} encType="multipart/form-data">
            <Input errorMessage={error && error.input === "nameInput" ? ERRORS[error.error] : undefined}
                label='Nome' name='name' id="nameInput" type={"text"} minLength={2} maxLength={35} required />
            <Input errorMessage={error && error.input === "emailInput" ? ERRORS[error.error] : undefined}
                label='E-mail' name='email' id="emailInput" type={"email"} maxLength={35} required />
            <Input errorMessage={error && error.input === "passwordInput" ? ERRORS[error.error] : undefined}
                label='Senha' name='password' id='passwordInput' type={"password"} minLength={8} maxLength={25} required />
            <Input label='Confirmar senha' name='passwordConfirm' id='passwordConfirmInput' type={"password"} minLength={8} maxLength={25} required />
            <Button isLoading={isLoading} type="submit" label='Prosseguir' style={{ width: "100%", paddingBlock: "1rem" }} />
            {TermsWarning}
        </form>,
        footer: <div className={"modalFooter"} onClick={() => changeSection("flow_choose", -1)}>
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const ConfirmEmail = {
        title: "Confirmar e-mail",
        hideVisibility: {
            background: true,
        },
        description: "Insira o código que acabamos de enviar para seu e-mail.",
        children: <div className={styles.section1}>
            <div id='emailCode' onKeyUp={onCodeInput} onPaste={handlePaste} className={styles.code}>
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
            </div>
            <button onClick={sendEmail} className={`${styles.resendEmail} ${styles.disabled}`}>Reenviar código (1:30)</button>
            <Hint size={"medium"} textColor={"var(--font-light)"} hint='Caso você não encontre nosso e-mail em sua caixa de entrada, procure no spam (às vezes acaba caindo lá!)' />
        </div>,
        footer: <div className='modalFooter' onClick={() => changeSection("flow_choose", -1)} >
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const Loading = {
        title: "Sua conta já está quase pronta!",
        hideVisibility: {
            background: true,
        },
        logoPosition: "top",
        description: "Estamos realizando os últimos ajustes, então, espera só mais um pouquinho!",
        children: <Button isLoading={true} style={{ width: "100%", paddingBlock: "1rem" }} />,
    } as Section;

    const Error = {
        title: "Eita! Algo deu errado.",
        hideVisibility: {
            background: true,
        },
        logoPosition: "top",
        description: "Por favor, tente novamente mais tarde. Caso o problema persista, entre em contato conosco.",
        footer: <div className='modalFooter' onClick={() => changeSection("flow_choose", -1)} >
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const AccountExists = {
        title: "Parece que você já tem uma conta!",
        hideVisibility: {
            background: true,
        },
        logoPosition: "top",
        description: "O e-mail que você inseriu já está cadastrado em nossa plataforma.",
        children: <Link href={`/auth/login`}><Button label='Fazer login' style={{ width: "100%", paddingBlock: "1rem" }} /></Link>,
    } as Section;

    const FinalSection = {
        title: "Já estamos prontos.",
        hideVisibility: {
            background: true,
            container: true,
        },
        logoPosition: "top",
        description: "Aproveite todas as funcionalidades da plataforma e crie eventos para amigos, trabalho e família com tranquilidade.",
        children: <Link href={`/dashboard`}><Button label='Entrar na plataforma' style={{ width: "100%", paddingBlock: "1rem" }} /></Link>,
    } as Section;

    type Sections = "flow_choose" | "google_flow" | "email_flow" | "email_confirm" | "loading" | "account_exists" | "final" | 'error';
    const sections = {
        "flow_choose": FlowChoose,
        "google_flow": GoogleFlow,
        "email_flow": EmailFlow,
        "email_confirm": ConfirmEmail,
        "loading": Loading,
        "error": Error,
        "account_exists": AccountExists,
        "final": FinalSection
    } as { [key: string]: Section };


    function changeSection(section: Sections, factor: number) {
        setSelected(null)
        setActualSection([section, factor])
    }

    return (
        <div className={styles.pageHolder}>
            <AuthModal initial={isAuth ? true : false} sections={sections} actualSection={actualSection} direction={direction} />
            {isAuth && <Landing hideBackground />}
        </div>
    )
}
