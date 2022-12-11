'use client';
import { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import axios from 'axios';
import { signIn } from "next-auth/react";

// Components
import AuthModal, { Section } from '../../../components/AuthModal';

// Stylesheets
import styles from '../auth.module.css';

const unselectedStyle = {
    padding: "2rem 2.5rem",
    gap: "2.5rem",
    justifyContent: "flex-start",
    backgroundColor: "var(--light)",
    border: "2px solid var(--primary-03)",
    color: "var(--primary-02)",
    width: "100%",
    borderRadius: "1rem",
}

const selectedStyle = {
    padding: "2rem 2.5rem",
    gap: "2.5rem",
    justifyContent: "flex-start",
    backgroundColor: "var(--primary-02)",
    border: "2px solid var(--primary-03)",
    color: "var(--light)",
    width: "100%",
    borderRadius: "1rem",
}

// Icons
import MailLockIcon from '../../../public/icons/mail_lock.svg';
import GoogleIcon from '../../../public/icons/google.svg';
import RightIcon from '../../../public/icons/arrow_right_alt.svg';

import GoogleLogo from '../../../public/icons/google.svg';

// Pages
import Landing from '../../page';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Hint from '../../../components/Hint';

export function GoogleButton(props: any) {
    return <Button
        icon={<GoogleLogo />}
        label={"Entrar com Google"}
        style={{
            padding: "1.2rem",
            gap: "3rem",
            backgroundColor: "var(--neutral)",
            border: "1px solid var(--light-gray)",
            color: "var(--font-light)",
            fontFamily: "Arial",
            width: "100%",
            fontWeight: 700,
            fontSize: "1.4rem",
            boxShadow: "0px 4px 15px 2px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
        }}
        {...props}
    />
}

interface AccountFormData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    code?: string;
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
                console.log(inputElement.value, codeArray[index])
                if (inputElement.value !== codeArray[index]) {
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

            console.log(inputLength)

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
        console.log(inputs, pastedData)
        inputs.forEach((input, index) => {
            const inputElement = input as HTMLInputElement;
            inputElement.value = pastedData.slice(index, index + 1) || '';
        });

        checkCode()
    }

    const [accountData, setAccountData] = useState<AccountFormData | null>(null);

    async function setupAccount() {
        if (accountData) {
            changeSection(undefined, 4);

            /* const { name, email, password } = accountData;

            const response = await axios.post('/api/auth/register', { name: name, email: email, password: password });

            if (response.status === 200) {
                try {
                    const response = await signIn('credentials', { email: email, password: password, redirect: false })
                    console.log(response)
                    if (response?.status === 200) {
                        changeSection(undefined, 5);
                    } else {
                        setAccountData(null)
                        changeSection(undefined, 0);
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                setAccountData(null)
                changeSection(undefined, 0);
            } */
        } else {
            console.error("Não foi possível criar a conta, pois os dados não foram fornecidos.");
        }
    }

    const EMAIL_RESEND_DELAY = 60;
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
                console.log(timer.current)
                resendEmailButton.disabled = true
                resendEmailButton.classList.add(styles.disabled)
            }

            const interval = setInterval(() => {
                timer.current -= 1;
                const resendEmailButton = document.getElementsByClassName(styles.resendEmail)[0] as HTMLButtonElement;
                if (resendEmailButton) {
                    resendEmailButton.textContent = `Reenviar código (${timer.current >= 60 ? Math.floor(timer.current / 60) : 0}:${timer.current % 60 < 10 ? "0" + timer.current % 60 : timer.current % 60})`;
                    console.log(resendEmailButton.textContent)
                    if (timer.current <= 0) {
                        resendEmailButton.disabled = false;
                        resendEmailButton.textContent = `Reenviar código`;
                        resendEmailButton.classList.remove(styles.disabled)
                        clearInterval(interval)
                    }
                }
            }, 1 * 1000);

            try {
                const response = await axios.post(`/api/sendEmail`, { emailProps: { code: data.code, name: data.name }, emailToSend: data.email });
                if (response.status === 200) {
                    console.log("E-mail enviado com sucesso.")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formAccountData = Object.fromEntries(formData.entries()) as unknown as AccountFormData;

        const { password, passwordConfirm } = formAccountData;

        if (password.normalize() !== passwordConfirm.normalize()) {
            const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
            const confirmPasswordInput = document.getElementById("passwordConfirmInput") as HTMLInputElement;

            passwordInput.style.outline = "2px solid var(--primary-01)";
            confirmPasswordInput.style.outline = "2px solid var(--primary-01)";

            setTimeout(() => {
                passwordInput.style.outline = "none";
                confirmPasswordInput.style.outline = "none";
            }, 3000);

            return;
        }

        const CONFIRMATION_CODE = Math.random().toString(36).substring(2, 7).toUpperCase();
        console.log(CONFIRMATION_CODE)

        formAccountData.code = CONFIRMATION_CODE;
        setAccountData(formAccountData)

        changeSection(undefined, 3);
        sendEmail(formAccountData)
    }

    const [[actualSection, direction], setActualSection] = useState([0, 1]);
    const [selected, setSelected] = useState<number | null>(null);

    const warningStyle = { textDecoration: "underline", cursor: "pointer" }
    const TermsWarning = <p style={{ color: "var(--primary-01)" }}>Ao se cadastrar, você concorda com os <Link style={warningStyle} href={`/terms-of-service`}>Termos de Serviço</Link> e a <Link style={warningStyle} href={`/privacy-policy`}>Política de Privacidade</Link>.</p>

    const Section0 = {
        title: "Vamos criar sua conta",
        description: "Antes de podermos criar, precisamos que você escolha como vai querer entrar na plataforma.",
        children: <div className={styles.section1}>
            <Button
                additionalClasses={`${styles.button} ${selected === 0 ? styles.selected : ""}`}
                icon={<GoogleIcon className={styles.optionIcon} />}
                style={selected === 0 ? selectedStyle : unselectedStyle}
                onClick={() => {
                    setSelected(0)
                }}
            >
                <div className={styles.buttonInfo}>
                    <h6>Entrar com o Google</h6>
                    <p>Fique despreocupado em ter que lembrar da senha de acesso à plataforma.</p>
                </div>
            </Button>
            <Button
                additionalClasses={`${styles.button} ${selected === 1 ? styles.selected : ""}`}
                icon={<MailLockIcon className={styles.optionIcon} />}
                style={selected === 1 ? selectedStyle : unselectedStyle}
                onClick={() => {
                    setSelected(1)
                }}
            >
                <div className={styles.buttonInfo}>
                    <h6>Entrar com e-mail e senha</h6>
                    <p>Utilize o método tradicional de autenticação. <br />
                        Você terá que lembrar de sua senha para entrar na plataforma.</p>
                </div>
            </Button>
            <Button onClick={() => {
                selected === 0 ? changeSection(undefined, 1) : changeSection(undefined, 2);
            }} label='Prosseguir' isDisabled={selected === null} style={{ width: "100%", paddingBlock: "1rem" }} />
        </div>,
        footer: <div className='modalFooter'><p className={styles.footer}>Já tem uma conta? <Link href={`/auth/login`} style={{ fontWeight: "bold" }}>Entrar</Link></p></div>
    } as Section;

    const Section1 = {
        title: "Estamos quase lá",
        description: "Agora falta muito pouco para administrar seus próprios eventos, basta entrar com sua conta Google para cadastrar-se.",
        children: <div className={styles.section1}>
            <GoogleButton />
            {TermsWarning}
        </div>,
        footer: <div className='modalFooter' onClick={() => changeSection(undefined, 0)}>
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const Section2 = {
        title: "Estamos quase lá",
        description: "Agora falta muito pouco para administrar seus próprios eventos, basta inserir as informações necessárias para cadastrar-se.",
        children: <form className={styles.section1} onSubmit={submitForm} encType="multipart/form-data">
            <Input label='Nome' name='name' type={"text"} minLength={2} maxLength={35} required />
            <Input label='E-mail' name='email' type={"email"} maxLength={35} required />
            <Input label='Senha' name='password' id='passwordInput' type={"password"} minLength={8} maxLength={25} required />
            <Input label='Confirmar senha' name='passwordConfirm' id='passwordConfirmInput' type={"password"} minLength={8} maxLength={25} required />
            <Button type="submit" label='Prosseguir' style={{ width: "100%", paddingBlock: "1rem" }} />
            {TermsWarning}
        </form>,
        footer: <div className={"modalFooter"} onClick={() => changeSection(undefined, 0)}>
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const Section3 = {
        title: "Confirmar e-mail",
        description: "Insira o código que acabamos de enviar para seu e-mail.",
        children: <div className={styles.section1}>
            <div id='emailCode' onKeyUp={onCodeInput} onPaste={handlePaste} className={styles.code}>
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} placeholder={"_"} />
            </div>
            <button onClick={sendEmail} className={`${styles.resendEmail} ${styles.disabled}`}>Reenviar código (1:00)</button>
            <Hint size={"medium"} textColor={"var(--font-light)"} hint='Caso você não encontre nosso e-mail em sua caixa de entrada, procure no spam (às vezes acaba caindo lá!)' />
        </div>,
        footer: <div className='modalFooter' onClick={() => changeSection(undefined, 0)} >
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const Loading = {
        title: "Sua conta já está quase pronta!",
        logoPosition: "top",
        description: "Estamos realizando os últimos ajustes, então, espera só mais um pouquinho!",
        children: <Button isLoading={true} style={{ width: "100%", paddingBlock: "1rem" }} />,
    } as Section;

    const FinalSection = {
        title: "Já estamos prontos.",
        logoPosition: "top",
        description: "Aproveite todas as funcionalidades da plataforma e crie eventos para amigos, trabalho e família com tranquilidade.",
        children: <Link href={`/dashboard`}><Button label='Entrar na plataforma' style={{ width: "100%", paddingBlock: "1rem" }} /></Link>,
    } as Section;

    const sections = [Section0, Section1, Section2, Section3, Loading, FinalSection];

    function changeSection(factor?: number, directNumber?: number) {
        setSelected(null)
        if (!factor && typeof directNumber === 'number') {
            if (directNumber > actualSection) {
                setActualSection([directNumber, 1])
            } else if (directNumber < actualSection) {
                setActualSection([directNumber, -1])
            }
        } else {
            console.log(factor, actualSection, sections.length)
            if (factor === 1 && actualSection < sections.length - 1) {
                setActualSection([actualSection + 1, 1])
            } else if (factor === -1 && actualSection > 0) {
                setActualSection([actualSection - 1, -1])
            } else {
                setActualSection([-1, 0])
            }
        }
    }

    return (
        <div className={styles.pageHolder}>
            <AuthModal initial={isAuth ? true : false} sections={sections} actualSection={actualSection} direction={direction} />
            {isAuth && <Landing hideBackground />}
        </div>
    )
}
