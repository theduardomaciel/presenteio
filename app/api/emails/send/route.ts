import { type NextRequest } from "next/server";

//
import { sendCodeEmailToUser, sendRevealEmailToGuest } from "./helper";

export async function POST(request: NextRequest) {
	const { emailProps, sendTo, resendRevealEmail } = await request.json();

	if (resendRevealEmail) {
		try {
			await sendRevealEmailToGuest(sendTo, emailProps);

			console.log("E-mail re-enviado com sucesso!");
			return new Response("E-mail re-sent with success!", {
				status: 200,
			});
		} catch (error) {
			console.log("Não foi possível re-enviar o e-mail.");
			return new Response(
				"It was not possible to re-send the reveal email!",
				{ status: 500, statusText: "Internal Server Error." }
			);
		}
	} else {
		try {
			await sendCodeEmailToUser(sendTo, emailProps);

			console.log("E-mail com código de acesso enviado com sucesso!");
			return new Response("E-mail with code sent with success!", {
				status: 200,
			});
		} catch (error) {
			console.log(
				"Não foi possível enviar o e-mail com o código de acesso."
			);
			return new Response("It was not possible to send the code email!", {
				status: 500,
				statusText: "Internal Server Error.",
			});
		}
	}
}
