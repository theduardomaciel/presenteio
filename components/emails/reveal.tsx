import { CSSProperties } from 'react';

import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import { Button } from '@react-email/button';
import { Img } from '@react-email/img';

import { EventType } from '@prisma/client';

export interface EmailProps {
    guestName: string;
    guestId: string;
    eventName?: string;
    eventType?: EventType;
    eventInviteCode?: string;
}

export default function RevealEmail({ guestName, guestId, eventName, eventType, eventInviteCode }: EmailProps) {
    const IMAGE_URL = `https://presenteio.vercel.app/api/images/generateEventImage?name=${eventName?.replaceAll(' ', '%20')}&type=${eventType}`
    const EVENT_REVEAL_URL = `https://presenteio.vercel.app/invite/${eventInviteCode}/reveal?guest=${guestId}`

    console.log(IMAGE_URL, EVENT_REVEAL_URL)

    return (
        <Html>
            <Head />
            <Container style={main}>
                <Text style={text}>
                    <strong>Problemas com o e-mail?</strong> <Link style={linkStyle} href={EVENT_REVEAL_URL}>Clique aqui para ver seu amigo secreto</Link>
                </Text>
                <Container style={container}>
                    {
                        eventName && eventType &&
                        <Img
                            src={`https://lh3.googleusercontent.com/wxDqhQKHLMUrAfaJ0xb8Xqph8vke0tNoHmLWPxLqizU6SkfVyr_y8_ZNVB1ZQKkBzsxoOoHxtzWcF7r8fZSzI4v3rQx9-SqrqpB2AnFVDOaF8LAqoWJRyMPPqURpK4FnincsrcQk-6s7i92DAClF43BWQtaQOZ0cA5WsAuFdlT1xT-aHJFXD2bMQf4l9c_7-IC37ukk7exVc5vxhoSPl9eTYEwgjSnDZ0xi7OmytOuboW-s0X8ELD82BFHYkfetGIVbjzPR82qaQs2749J434Zh7VTPrrZ7UvuUEpeRhEnsNARQdK5Jdy3bSWU2DbccWOjC5CinUGYJUNDVENsFvxb161VEoc0-gDqleLcoRgNPNkyZOFVXDRoP_uvrZBYLD3e35VzV-6N4OZoSX4DNEhqOG6VzqFKMwWhsLASbhaN4iKh3QPiN9LrVM2xMnHYOcZlmRPh_F6JOWBEgZmDVSxaAOzB4wkUeuN5BjB34um5bBn_gEzIJPtgKt1xcja5hk_jsVKwHNx8k_xhsr6o7sJHGrQrpQmh1CjcADSboOG4n4qXhqjzA8kSyos8BgjG0QsnYZYsAiHo6RY_dlVYqTy5PYu0Pugutb4E6i25csQwLVFSSUupLeLgELXNUF8yVVuHZYLK4tTJTvPdnTzpCH1AshG5IH93n9gPOXwilFIXPJITmQt2WWyVAgw-6V-UznIpNe_x3-tFsRuoMPiYjqnj4TueghVsjP4O_IrdxAyqRH-NHMgjjp1VBu2TjIEuIf5M0jvd_0EdR_932T1XmfZ1Gl38rLqdOAeTSRM18ScVv0UHgLZmwO2dsXRRh4EBuf-ntaF8vJcAm6ns7lB73SmXhcaYxYljRURaizjDY4xA65stUr642p-4HEwVsf4K1PY7MbgwIr2EFX0oTwhCH3hoF5o5IR6ludcWxK7oWOeuk_BYql9nR8p98gv-_ELtsj1lszV6ynHSa62NtMs1C_I-eNVnCqYD1VTyFxKqptR_T36LNaQCglaLo=w600-h200-no?authuser=0`}
                            width="300"
                            height="100"
                            alt="event logo"
                            style={logo}
                        />
                    }
                    <Text style={h1}>
                        Olá, {guestName} 👋
                    </Text>
                    <Text style={text}><strong>Empolgado para descobrir quem é seu Amigo Secreto?</strong> <br />
                        Você está a poucos passos da descoberta, basta pressionar o botão abaixo para ser redirecionado para a página de revelação. <br /> <br />
                        Então, o que está esperando? Vai lá!
                    </Text>
                    <Button
                        href={EVENT_REVEAL_URL}
                        style={button}
                    >
                        Descobrir meu Amigo Secreto
                    </Button>
                </Container>
            </Container>
        </Html>
    );
}

const main = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    width: "100%",
    display: "block" as const,
    paddingRight: "150px"
} as CSSProperties;

const container = {
    padding: '55px 72px',
    border: '1px solid #D9D9D9',
    borderRadius: '5px',
    margin: '40px auto',
    width: '660px',
} as CSSProperties;

const logo = {
    margin: '0 auto',
    objectFit: "contain",
} as CSSProperties;

const h1 = {
    color: '#FF2626',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '0',
} as CSSProperties;

const text = {
    color: '#797979',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
    lineHeight: '24px',
} as CSSProperties;

const linkStyle = {
    color: '#797979',
    textDecoration: "underline",
    cursor: "pointer",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
    lineHeight: '24px',
} as CSSProperties;

const button = {
    background: "#FF3D3D",
    padding: "15px 20px",
    borderRadius: "0.5rem",
    fontStyle: "normal" as const,
    fontSize: 18,
    marginBlock: 35,
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block' as const,
    width: '100%',
    color: 'white',
} as CSSProperties;