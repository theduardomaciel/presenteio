import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Icons
import SendEmail from "@/public/icons/send_email.svg";

// Components
import Modal, { type ModalProps } from "components/Modal";

// Types
import type { Guest, Event } from "@prisma/client";
import type { ToastDynamicProps } from "components/_ui/Toast";

interface Props {
	guest: Omit<Guest, "event">;
	event: Omit<Event, "createdAt">;
	setToastVisible: React.Dispatch<React.SetStateAction<ToastDynamicProps>>;
}

export default function ResendEmailToGuest({
	guest,
	event,
	setToastVisible,
}: Props) {
	const [resendEmailModalState, setResendEmailModalState] =
		useState<ModalProps>({ status: false });

	const router = useRouter();

	async function resendEmail() {
		setResendEmailModalState({
			status: "pending",
			headerProps: {
				title: "Enviando e-mail...",
				description:
					"Aguarde enquanto tentamos enviar o e-mail novamente para o convidado.",
			},
		});

		const resendEmailTimestampString = localStorage.getItem(
			"resendEmailTimestamp"
		);
		if (resendEmailTimestampString) {
			if (
				new Date().getTime() - parseInt(resendEmailTimestampString) <
				86400000
			) {
				setResendEmailModalState({
					status: "error",
					headerProps: {
						description:
							"Você já reenviou um e-mail recentemente. Por favor, aguarde 24 horas para reenviar outro e-mail.",
					},
				});
				return;
			}
		}

		try {
			const response = await axios.post(`/api/emails/send`, {
				resendRevealEmail: true,
				sendTo: guest.email,
				emailProps: {
					guestName: guest.name,
					guestId: guest.id,
					eventName: event.name,
					eventType: event.type,
					eventInviteCode: event.inviteCode,
				},
			});
			console.log(response);
			if (response) {
				localStorage.setItem(
					"resendEmailTimestamp",
					new Date().getTime().toString()
				);
				setResendEmailModalState({ status: false });
				setToastVisible([
					true,
					{
						icon: (
							<SendEmail
								color="var(--primary-01)"
								width={36}
								height={36}
							/>
						),
						title: "E-mail enviado!",
						description:
							"Enviamos o e- mail com o resultado para o convidado.",
					},
				]);
				router.refresh();
			} else {
				setResendEmailModalState({
					status: "error",
					headerProps: {
						description:
							"Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde.",
					},
				});
			}
		} catch (error) {
			console.log(error);
			setResendEmailModalState({
				status: "error",
				headerProps: {
					description:
						"Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde.",
				},
			});
		}
	}

	return (
		<Fragment>
			<SendEmail
				color="var(--neutral)"
				width={22}
				height={22}
				onClick={() => setResendEmailModalState({ status: true })}
			/>
			<Modal
				status={resendEmailModalState.status}
				toggleVisibility={() =>
					setResendEmailModalState({ status: false })
				}
				headerProps={{
					icon: (
						<SendEmail
							color="var(--neutral)"
							width={"2.4rem"}
							height={"2.4rem"}
						/>
					),
					title:
						resendEmailModalState.headerProps?.title ||
						"Reenviar e-mail",
					description:
						resendEmailModalState.headerProps?.description ||
						`Use essa função somente caso o convidado não tenha recebido o e-mail ou o deletado por engano, pois o envio de novos e-mails possui um intervalo de 24 horas.\n
                    Antes de reenviar o e-mail, verifique com o convidado se o e-mail ocupa-se em outras seções como o spam ou promoções.`,
				}}
				returnButton={{
					enabled:
						resendEmailModalState.status !== "pending"
							? true
							: false,
				}}
				buttons={
					resendEmailModalState.status === true
						? [
								{
									text: "Reenviar e-mail",
									onClick: resendEmail,
								},
						  ]
						: undefined
				}
			/>
		</Fragment>
	);
}
