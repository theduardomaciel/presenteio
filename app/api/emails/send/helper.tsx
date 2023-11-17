import React from "react";
import { render } from "@react-email/render";

import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

// Components
import CodeEmail, { CodeEmailProps } from "components/_emails/code";
import RevealEmail, { RevealEmailProps } from "components/_emails/reveal";

export async function sendRevealEmailToGuest(
	sendTo: string,
	emailProps: RevealEmailProps
) {
	const emailHtml = render(<RevealEmail {...emailProps} />, {
		pretty: true,
	});

	const options = {
		from: "app.presenteio@gmail.com",
		to: sendTo,
		subject: "Chegou a hora tão esperada! Vem conferir seu amigo secreto!",
		html: emailHtml,
	};

	try {
		sendgrid.send(options);
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
	const emailHtml = render(<CodeEmail {...emailProps} />, {
		pretty: true,
	});

	const options = {
		from: "app.presenteio@gmail.com",
		to: sendTo,
		subject:
			"Seu código de verificação para concluir seu cadastro no presenteio",
		html: emailHtml,
	};

	try {
		await sendgrid.send(options);
		console.log("E-mail sent with success!");
		return new Response("E-mail sent with success!", { status: 200 });
	} catch (error) {
		console.log(error);
		throw new Error("There was not possible to send the e-mail.");
	}
}
