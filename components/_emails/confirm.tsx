import { CSSProperties } from "react";

import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Container } from "@react-email/container";
import { Text } from "@react-email/text";
import { Link } from "@react-email/link";
import { Button } from "@react-email/button";
import { Img } from "@react-email/img";

import { EventType } from "@prisma/client";

export interface RevealEmailProps {
	guestName: string;
	guestId: string;
	eventName?: string;
	eventType?: EventType;
	eventInviteCode?: string;
}

export default function ConfirmEmail({
	guestName,
	guestId,
	eventName,
	eventType,
	eventInviteCode,
}: RevealEmailProps) {
	const EVENT_CONFIRM_URL = `https://presenteio.vercel.app/invite/${eventInviteCode}?guest=${guestId}`;
	const EVENT_IMAGE_URL = `https://presenteio.vercel.app/api/images/generate/event?name=${eventName?.replaceAll(
		" ",
		"%20"
	)}&type=${eventType}`;

	//console.log(IMAGE_URL, EVENT_CONFIRM_URL);

	return (
		<Html>
			<Head />
			<Container style={main}>
				<Container style={container}>
					{eventName && eventType && (
						<Img
							src={
								EVENT_IMAGE_URL ||
								`https://i.imgur.com/b61gJWS.png`
							}
							width="300"
							height="100"
							alt="Event logo"
							style={logo}
						/>
					)}
					<Text style={h1}>Olá, {guestName} 👋</Text>
					<Text style={text}>
						<strong>
							Precisamos confirmar sua participação no evento!
						</strong>{" "}
						<br />
						Para isso, basta entrar no link e concluir seu cadastro.
						<br /> <br />
						ps.: Sugerimos colocar uma foto de perfil para que a revelação seja mais emocionante pra todo mundo!
					</Text>
					<Button href={EVENT_CONFIRM_URL} style={button}>
						Confirmar meu cadastro
					</Button>
				</Container>
				<Text style={subText}>
					<strong>
						Caso o botão acima não funcione, visite a página
						diretamente por meio do link abaixo:
					</strong>
					<br /> <br />
					<Link style={linkStyle} href={EVENT_CONFIRM_URL}>
						{EVENT_CONFIRM_URL}
					</Link>
				</Text>
			</Container>
		</Html>
	);
}

const main = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	width: "100%",
	display: "block" as const,
	paddingRight: "150px",
} as CSSProperties;

const container = {
	padding: "55px 72px",
	border: "1px solid #D9D9D9",
	borderRadius: "5px",
	margin: "40px auto",
	width: "660px",
} as CSSProperties;

const logo = {
	margin: "0 auto",
	objectFit: "contain",
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

const subText = {
	color: "#797979",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	lineHeight: "24px",
	marginTop: "30px",
} as CSSProperties;

const linkStyle = {
	color: "#797979",
	textDecoration: "underline",
	cursor: "pointer",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "16px",
	lineHeight: "24px",
} as CSSProperties;

const button = {
	background: "#FF3D3D",
	padding: "15px 0px",
	borderRadius: "0.5rem",
	fontStyle: "normal" as const,
	fontSize: 18,
	marginBlock: 35,
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block" as const,
	width: "100%",
	color: "white",
} as CSSProperties;
