import { type NextRequest } from "next/server";

import prisma from "lib/prisma";

import React from "react";
import { render } from "@react-email/render";

import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");

// Components
import CodeEmail from "components/_emails/code";
import RevealEmail, { EmailProps } from "components/_emails/reveal";

export async function POST(request: NextRequest) {
	const { emailProps, sendTo, resendRevealEmail } = await request.json();

	if (resendRevealEmail) {
		const response = await sendEmailToGuest(sendTo, emailProps);
		if (response) {
			console.log("E-mail re-enviado com sucesso!");
			return new Response("E-mail re-sent with success!", {
				status: 200,
			});
		} else {
			console.log("Não foi possível re-enviar o e-mail.");
			return new Response("Something broke!", { status: 500 });
		}
	} else {
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
			console.log("Sending e-mail...");
			await sendgrid.send(options);
			return new Response("E-mail sent with success!", { status: 200 });
		} catch (error) {
			console.log(error);
			return new Response("Something broke!", { status: 500 });
		}
	}
}

export async function sendEmailToGuest(sendTo: string, emailProps: EmailProps) {
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
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
