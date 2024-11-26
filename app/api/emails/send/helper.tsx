import React from "react";
import { render } from "@react-email/render";

import { Resend } from 'resend';
const resend = new Resend(process.env.EMAIL_API_KEY);

// Components
import CodeEmail, { CodeEmailProps } from "components/_emails/code";
import RevealEmail, { RevealEmailProps } from "components/_emails/reveal";
import ConfirmEmail from "components/_emails/confirm";

export async function sendConfirmationEmailToGuest(
	sendTo: string,
	emailProps: RevealEmailProps
) {
	const emailHtml = await render(<ConfirmEmail {...emailProps} />, {
		pretty: true,
	});

	try {
		resend.emails.send({
			from: "onboarding@resend.dev",
			to: sendTo,
			subject: "Vamos confirmar sua participação no evento?",
			html: emailHtml,
		})
		console.log("E-mail sent with success!");
	} catch (error) {
		console.log(error);
		throw new Error("There was not possible to send the e-mail.");
	}
}

export async function sendAllRevealEmailsToGuests(
	props: RevealEmailProps[]
) {
	const emailsHtml = await Promise.all(
		props.map(async (guest) => {
			return await render(<RevealEmail {...guest} />, {
				pretty: true,
			});
		})
	);

	try {
		await resend.batch.send(props.map((guest) => ({
			from: "onboarding@resend.dev",
			to: guest.guestEmail,
			subject: "Chegou a hora tão esperada! Vem conferir seu amigo secreto!",
			html: emailsHtml[props.indexOf(guest)],
		})));
	} catch (error) {
		console.log(error);
		throw new Error("There was not possible to send the e-mail.");
	}
}

export async function sendRevealEmailToGuest(
	sendTo: string,
	emailProps: RevealEmailProps
) {
	const emailHtml = await render(<RevealEmail {...emailProps} />, {
		pretty: true,
	});

	try {
		resend.emails.send({
			from: "app.presenteio@gmail.com",
			to: sendTo,
			subject: "Chegou a hora tão esperada! Vem conferir seu amigo secreto!",
			html: emailHtml,
		});
		console.log("E-mail sent with success!");
	} catch (error) {
		console.log(error);
		throw new Error("There was not possible to send the e-mail.");
	}
}

export async function sendCodeEmailToUser(
	sendTo: string,
	emailProps: CodeEmailProps
) {
	const emailHtml = await render(<CodeEmail {...emailProps} />, {
		pretty: true,
	});

	try {
		resend.emails.send({
			from: "app.presenteio@gmail.com",
			to: sendTo,
			subject:
				"Seu código de verificação para concluir seu cadastro no presenteio",
			html: emailHtml,
		})
		console.log("E-mail sent with success!");
		return new Response("E-mail sent with success!", { status: 200 });
	} catch (error) {
		console.log(error);
		throw new Error("There was not possible to send the e-mail.");
	}
}
