'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
}

function onCodeInput(event: any) {
    const target = event.srcElement || event.target;
    const inputLength = target.value.length;
    // no código de e-mail cada quadradinho tem tamanho máximo 1;

    if (!parseInt(target.value)) {
        target.value = '';
    }

    console.log(event.keyCode)

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
                        /* root.style.display = "none"; */
                        root.remove();
                    }
                }, 1000);
            }, 500);

            const emailCodeContainer = document.getElementById("emailCode");
            if (emailCodeContainer) {
                emailCodeContainer.addEventListener('keyup', onCodeInput)
                emailCodeContainer.addEventListener('paste', handlePaste);
                return () => {
                    emailCodeContainer.removeEventListener('keyup', onCodeInput)
                    emailCodeContainer.removeEventListener('paste', handlePaste);
                };
            }
        }
    }, [])

    async function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const accountData = Object.fromEntries(formData.entries()) as unknown as AccountFormData;

        const { name, email, password, passwordConfirm } = accountData;

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

        changeSection(undefined, 3);

        console.log(accountData)
    }

    const [[actualSection, direction], setActualSection] = useState([3, 1]);
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
        footer: <p className={styles.footer}>Já tem uma conta? <Link href={`/auth/login`} style={{ fontWeight: "bold" }}>Entrar</Link></p>
    } as Section;

    const Section1 = {
        title: "Estamos quase lá",
        description: "Agora falta muito pouco para administrar seus próprios eventos, basta entrar com sua conta Google para cadastrar-se.",
        children: <div className={styles.section1}>
            <GoogleButton />
            {TermsWarning}
        </div>,
        footer: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", cursor: "pointer" }} onClick={() => changeSection(undefined, 0)}>
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const Section2 = {
        title: "Estamos quase lá",
        description: "Agora falta muito pouco para administrar seus próprios eventos, basta inserir as informações necessárias para cadastrar-se.",
        children: <form className={styles.section1} onSubmit={submitForm}>
            <Input label='Nome' name='name' type={"text"} minLength={2} maxLength={35} required />
            <Input label='E-mail' name='email' type={"email"} maxLength={35} required />
            <Input label='Senha' name='password' id='passwordInput' type={"password"} minLength={10} maxLength={30} required />
            <Input label='Confirmar senha' name='passwordConfirm' id='passwordConfirmInput' type={"password"} minLength={10} maxLength={30} required />
            <Button type="submit" label='Prosseguir' style={{ width: "100%", paddingBlock: "1rem" }} />
            {TermsWarning}
        </form>,
        footer: <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", cursor: "pointer" }} onClick={() => changeSection(undefined, 0)}>
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const Section3 = {
        title: "Confirmar e-mail",
        description: "Insira o código que acabamos de enviar para seu e-mail.",
        children: <div id='emailCode' className={styles.section1}>
            <div className={styles.code}>
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} />
                <input className={styles.codeNumber} type="text" pattern="[0-9]+" maxLength={1} />
            </div>
            <p style={{ fontFamily: "Arial", fontSize: "1.2rem" }}>Reenviar código (0:12)</p>
            <Hint size={"medium"} textColor={"var(--font-light)"} hint='Caso você não encontre nosso e-mail em sua caixa de entrada, procure no spam (às vezes acaba caindo lá!)' />
        </div>,
        footer: <div
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", cursor: "pointer" }}
            onClick={() => changeSection(undefined, 0)}
        >
            <RightIcon style={{ transform: "rotate(180deg)", display: "inline" }} className={styles.optionIcon} width={"1.6rem"} height={"1.6rem"} />
            <p className={styles.footer} style={{ fontWeight: 700 }}> Voltar para o início </p>
        </div>
    } as Section;

    const FinalSection = {
        title: "Já estamos prontos.",
        logoPosition: "top",
        description: "Aproveite todas as funcionalidades da plataforma e crie eventos para amigos, trabalho e família com tranquilidade.",
        children: <Button label='Entrar na plataforma' style={{ width: "100%", paddingBlock: "1rem" }} />,
    } as Section;

    const sections = [Section0, Section1, Section2, Section3, FinalSection];

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
            <AuthModal sections={sections} actualSection={actualSection} direction={direction} />
            {isAuth && <Landing />}
        </div>
    )
}
