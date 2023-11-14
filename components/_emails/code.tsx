import { CSSProperties } from "react";

import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Container } from "@react-email/container";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";

interface EmailProps {
	code: string;
	name: string;
}

export default function CodeEmail({ code, name }: EmailProps) {
	return (
		<Html>
			<Head />
			<Container style={main}>
				<Container style={container}>
					<Img
						src="https://i.imgur.com/b61gJWS.png"
						width="230"
						height="35"
						alt="presenteio logo"
						style={logo}
					/>
					<Text style={h1}>Olá, {name} 👋</Text>
					<Text style={text}>
						<strong>Pronto para concluir seu cadastro?</strong>{" "}
						<br />
						Insira o seguinte código no site para terminar a
						configuração de sua conta:
					</Text>
					<Container style={codeHolder}>
						<Text style={codeText}>{code}</Text>
					</Container>
					<Text style={text}>
						<strong>
							Se o código não funcionar, reinicie o processo de
							criação de sua conta e tente seguir estas instruções
							para solucionar o problema:
						</strong>
					</Text>
					<ul>
						<li style={text}>
							Use uma aba anônima no navegador ou um navegador
							diferente
						</li>
						<li style={text}>
							Limpe o cache e os cookies do seu navegador, e
							desative todos os complementos ou extensões do
							navegador
						</li>
						<li style={text}>
							Caso esteja no celular, crie sua conta por um
							computador
						</li>
					</ul>
					<Text style={text}>
						Caso o problema persista, entre em contato conosco por
						meio do e-mail <strong>app.presenteio@gmail.com</strong>{" "}
						para resolver problemas diretamente.
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
	backgroundColor: "#ffffff",
	margin: "0 auto",
	paddingRight: "150px",
};

const container = {
	padding: "55px 72px",
	border: "1px solid #D9D9D9",
	borderRadius: "5px",
	margin: "40px auto",
	width: "660px",
} as CSSProperties;

const logo = {
	margin: "0 auto",
} as CSSProperties;

const h1 = {
	color: "#FF2626",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "32px",
	fontWeight: "700",
	textAlign: "center" as const,
	margin: "30px 0",
	padding: "0",
} as CSSProperties;

const text = {
	color: "#797979",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "16px",
	lineHeight: "24px",
} as CSSProperties;

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
	color: "#141414",
} as CSSProperties;
