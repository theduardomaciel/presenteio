import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Img } from '@react-email/img';
import { CSSProperties } from 'react';

interface EmailProps {
    code: string;
    name: string;
}

/* export default function CodeEmail({ code, name }: EmailProps) {
    return (
        <Html lang="pt-br">
            <Head />
            <Container className={styles.mainContainer}>
                <Img
                    src="../../../public/logo.png"
                    width="230"
                    height="35"
                    className={styles.logo}
                    alt="presenteio logo"
                />
                <h1 className={styles.title}>Olá, {name} 👋</h1>
                <Text><strong>Pronto para concluir seu cadastro?</strong> <br />
                    Insira o código seguinte no site para terminar a configuração de sua conta:</Text>
                <Container className={styles.codeHolder}>
                    <Text>{code}</Text>
                </Container>
                <Text>Esse código irá expirar em duas horas.</Text>
                <Text>Se o código não funcionar, reinicie o processo de criação de sua conta e tente seguir estas instruções para solucionar o problema:</Text>
                <ul>
                    <li>Use uma aba anônima no navegador ou um navegador diferente </li>
                    <li>Limpe o cache e os cookies do seu navegador, e desative todos os complementos ou extensões do navegador</li>
                </ul>
                <Text>Caso o problema persista, entre em contato conosco por meio do e-mail <strong>app.presenteio@gmail.com</strong> para resolver problemas diretamente.</Text>
                <Text>
                    Agradecemos, <br />
                    Equipe Presenteio
                </Text>
            </Container>
        </Html>
    );
} */

export default function CodeEmail({ code, name }: EmailProps) {
    return (
        <Html>
            <Head />
            <Container style={main}>
                <Container style={container}>
                    <Img
                        src="https://lh3.googleusercontent.com/rNWriDkSd4K1y3pHg5knfCFoJRHvnkaupXG45lHgGGvf1uc0CQhMdkcl1imAvXCLaq7HdllMUrRkgeJccX4_09mgFXDMOjiIYMaYZl6eVJWtMIDrC__N7gI-yCr5JdL2ohs_G8XpxKux9Et5Eaoaobdzj7EwQsHWe5YGQuAlaEMKwXRbRwOzJfm_yI-RKxEbkvWaMvdrQCnymu16Lv6Kc-YKUYlFa389ZXB-m10x3KJnObmyozj7HuN2jhhApvQbG_w6_chcSublOEX6qRG7MDh21wEFFxz5lVWBzogB1ReoXyoxNTCzofbuJj-SwUQM2nHuSMXRBSyfzGE9kiOG73uZL-I4BNpwxsnM3gPL25R4agnoQAZqZ3J8Fpo0WGoLEDTH0FvDZc3zgXr0TN93naHqoU-c1txt9AiQzYKef0sZCHp6i7CwMmElvzxGpoysJ32UqVyGaU-pZ6cg6tCwwfHJO2cjStRjCZ8nITcxTJVmqpbFoczE30utlYBpgrVa6UkdcV95b8azI8QzvIJUbMLqNWoIj4GubHN2ESABIY0a9tO5S5lrt-rfIppe88Q4kTBFHXGjVs4fE1JgDAR8Pmvx6hLBPTcCM6nJER0_N-9nPJSiX1bP5CoMBx7K_Iy7uQ0TlRs43YjS3IFdti3sglx5JSUWX1vie7Wp31n-vq-fvRg2HcmIYnvONYeBXY72QdfkxJEhYOcDh8iiSmOSWI5bpJAm9E8Ci7vcwwvVOkr_AatuidBXS6m0gooXhf_5tKjd3vLNEr9hl357Jj78GJfwufi_5xmTCNTuACLQIg3GvFRnr1NXXhLCjUrqmlf78D-qvlTDQLvxzCh284hHFN3Vgm263V0id2DPKlSW99MLnpi18ySDy_cxkukIT4T2MByoZNSYRIeC3IhVi8GeTPvKChteBtZGNPLPeCwsZdTMhrvmlXUyR0bMcY_0WRWbeUyRQrYZoDLCl5eKeESTzT1fiLZEnbCVlhQzUfRN3kjX7NvH57WG_0k=w230-h35-no?authuser=0"
                        width="230"
                        height="35"
                        alt="presenteio logo"
                        style={logo}
                    />
                    <Text style={h1}>
                        Olá, {name} 👋
                    </Text>
                    <Text style={text}><strong>Pronto para concluir seu cadastro?</strong> <br />
                        Insira o seguinte código no site para terminar a configuração de sua conta:
                    </Text>
                    <Container style={codeHolder}>
                        <Text style={codeText}>{code}</Text>
                    </Container>
                    <Text style={text}>
                        <strong>Se o código não funcionar, reinicie o processo de criação de sua conta e tente seguir estas instruções para solucionar o problema:</strong>
                    </Text>
                    <ul >
                        <li style={text}>Use uma aba anônima no navegador ou um navegador diferente</li>
                        <li style={text}>Limpe o cache e os cookies do seu navegador, e desative todos os complementos ou extensões do navegador</li>
                        <li style={text}>Caso esteja no celular, crie sua conta por um computador</li>
                    </ul>
                    <Text style={text}>
                        Caso o problema persista, entre em contato conosco por meio do e-mail <strong>app.presenteio@gmail.com</strong> para resolver problemas diretamente.
                    </Text>
                    <Text style={text}>
                        Agradecemos, <br />
                        Equipe Presenteio
                    </Text>
                </Container>
            </Container>
        </Html>
    );
}

const main = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    paddingRight: "150px"
};

const container = {
    padding: '55px 72px',
    border: '1px solid #D9D9D9',
    borderRadius: '5px',
    margin: '40px auto',
    width: '660px',
};

const logo = {
    margin: '0 auto',
};

const h1 = {
    color: '#FF2626',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '0',
};

const text = {
    color: '#797979',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
    lineHeight: '24px',
};

const codeHolder = {
    padding: "10px 0",
    border: "1px solid #797979",
    borderRadius: "0.5rem",
} as CSSProperties;

const codeText = {
    fontStyle: "normal" as const,
    fontWeight: "700",
    fontSize: "36px",
    margin: "auto auto",
    textAlign: "center" as const,
    color: '#141414',
}