"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Styling
import styles from "../styles.module.css";
import { DISABLED_BUTTON, ENABLED_BUTTON } from "./styles";

// Components
import Button from "components/_ui/Button";
import Modal, { ModalProps } from "components/Modal";
import DashboardToast, { ToastDynamicProps } from "components/_ui/Toast";

import EventEditModal from "./modals/EventEdit";
import EventDeleteModal from "./modals/EventDelete";

// Assets
import SendEmail from "@/public/icons/send_email.svg";
import CloseIcon from "@/public/icons/close.svg";
import ArrowRightIcon from "@/public/icons/arrow_right_alt.svg";

// Utils
import type { Event, Guest } from "@prisma/client";

export default function ButtonsHolder({
	event,
}: {
	event: Omit<Event & { guests: Guest[] }, "createdAt">;
}) {
	const [sendEmailModalState, setSendEmailModalState] = useState<ModalProps>({
		status: false,
	});

	const [[isToastVisible, toastProps], setToastVisible] =
		useState<ToastDynamicProps>([false]);

	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	async function raffleGuests() {
		setLoading(true);
		setSendEmailModalState({
			status: "pending",
			headerProps: {
				title: "Aguarde um momento...",
				description:
					"Estamos sorteando os convidados e enviando os e-mails com os resultados pessoais a todos.",
			},
		});

		try {
			const response = await axios.post(`/api/events/raffle`, {
				id: event.id,
			});
			if (response) {
				setLoading(false);
				setSendEmailModalState({
					status: "success",
					headerProps: {
						title: "Os e-mails foram enviados com sucesso!",
						description: `Todos os participantes já foram sorteados, agora, basta que cada um acesse seu e-mail para descobrir quem foi seu sorteado!\n\nA partir de agora, nenhum outro participante pode entrar no evento.`,
					},
				});
				router.refresh();
			} else {
				setLoading(false);
				setSendEmailModalState({
					status: "error",
					headerProps: {
						description:
							"Um erro interno nos impediu de sortear os convidados. Por favor, tente novamente mais tarde.",
					},
				});
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSendEmailModalState({
				status: "error",
				headerProps: {
					description:
						"Um erro interno nos impediu de sortear os convidados. Por favor, tente novamente mais tarde.",
				},
			});
		}
	}

	const MIN_GUESTS = 3;
	const DISABLED = useMemo(
		() =>
			event.status === "DIVULGED" ||
			event.guests.filter((guest) => guest.status === "CONFIRMED")
				.length < MIN_GUESTS,
		[event]
	);

	const hasGuestsWithoutEmail =
		event.guests.filter((guest) => !guest.email).length > 0;

	return (
		<>
			<div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4">
				<Button
					style={DISABLED ? DISABLED_BUTTON : ENABLED_BUTTON}
					isLoading={isLoading}
					className="w-full lg:w-1/2"
					onClick={() => {
						if (DISABLED) {
							if (event.status === "DIVULGED") {
								setToastVisible([
									true,
									{
										status: "info",
										title: "Infelizmente, não é possível realizar esta ação.",
										description: `O sorteio já foi realizado e os e-mails já foram enviados.`,
									},
								]);
							} else {
								setToastVisible([
									true,
									{
										status: "info",
										title: "Infelizmente, não é possível realizar esta ação.",
										description: `Para realizar o sorteio, o evento deve ter pelo menos ${MIN_GUESTS} convidados confirmados.`,
									},
								]);
							}
						} else {
							setSendEmailModalState({ status: true });
						}
					}}
				>
					<SendEmail height={22} width={22} />
					Sortear e enviar e-mails
				</Button>
				<div className="flex flex-row items-center justify-end gap-[1.5rem] w-full lg:w-1/2">
					<EventEditModal
						event={{
							...event,
							guestsWithoutEmail: event.guests.filter(
								(guest) => !guest.email
							).length,
						}}
					/>
					<EventDeleteModal eventId={event?.id} />
				</div>
			</div>

			<Modal
				status={sendEmailModalState.status}
				toggleVisibility={() =>
					setSendEmailModalState({ status: false })
				}
				style={{ gap: "3.5rem" }}
				headerProps={{
					icon:
						sendEmailModalState.status === true ? (
							<SendEmail
								color="var(--neutral)"
								width={"2.4rem"}
								height={"2.4rem"}
							/>
						) : undefined,
					insertLogo: sendEmailModalState.status !== true,
					title:
						sendEmailModalState.headerProps?.title ||
						`Você tem certeza que deseja enviar os e-mails?`,
					description:
						sendEmailModalState.headerProps?.description ||
						`${
							hasGuestsWithoutEmail
								? "Alguns convidados ainda não inseriram seus e-mails, portanto nem todos receberão o link em sua caixa de entrada!\n\n"
								: ""
						}Após enviar os e-mails, novos usuários não poderão participar do evento e a edição das informações dos convidados será bloqueada.`,
				}}
				returnButton={{
					enabled:
						sendEmailModalState.status !== "pending" ? true : false,
					text:
						sendEmailModalState.status === true
							? "Cancelar"
							: "Voltar",
					icon:
						sendEmailModalState.status === true ? (
							<CloseIcon />
						) : (
							<ArrowRightIcon
								fill="var(--primary-01)"
								width={18}
								height={18}
								style={{ transform: "rotate(180deg)" }}
							/>
						),
					onClick: () => setSendEmailModalState({ status: false }),
				}}
				buttons={
					sendEmailModalState.status === (true || "pending")
						? [
								{
									text: "Enviar e-mails",
									onClick: raffleGuests,
								},
						  ]
						: undefined
				}
			/>

			<DashboardToast
				toastProps={toastProps}
				isOpened={isToastVisible}
				setDynamicOpened={setToastVisible}
			/>
		</>
	);
}
