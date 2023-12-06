"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Icons
import ResetIcon from "@/public/icons/reset.svg";

// Components
import Modal, { ModalProps } from "components/Modal";
import Button from "components/_ui/Button";

// Types
import type { ToastDynamicProps } from "components/_ui/Toast";

interface Props {
	eventId?: string;
	setToastVisible: Dispatch<SetStateAction<ToastDynamicProps>>;
}

export default function EventResetModal({ eventId, setToastVisible }: Props) {
	const router = useRouter();

	const [resetModalState, setResetModalState] = useState<ModalProps>({
		status: false,
	});

	async function resetEvent() {
		setResetModalState({
			status: "pending",
			headerProps: {
				description:
					"Estamos reiniciando o evento e todos os seus convidados.",
			},
		});

		try {
			const response = await axios.patch(`/api/events/${eventId}`, {
				status: "PENDING",
				reset: true,
			});

			if (response) {
				router.refresh();

				setResetModalState({
					status: false,
				});

				setToastVisible([
					true,
					{
						status: "success",
						title: "Evento reiniciado com sucesso!",
						description:
							"Agora é possível adicionar convidados e realizar o sorteio novamente.",
					},
				]);
			} else {
				setResetModalState({
					status: "error",
					headerProps: {
						description:
							"Um erro interno nos impediu de reiniciar o evento. Por favor, tente novamente mais tarde.",
					},
				});
			}
		} catch (error) {
			console.log(error);
			setResetModalState({
				status: "error",
				headerProps: {
					description:
						"Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde.",
				},
			});
		}
	}

	if (!eventId) {
		console.error(
			"EventResetModal: You must provide an eventId to the component"
		);
		return null;
	}

	return (
		<Fragment>
			<Button
				type="button"
				className="px-4 flex-1"
				onClick={() => {
					setResetModalState({ status: true });
				}}
			>
				<ResetIcon color="var(--neutral)" width={18} height={18} />
				Reiniciar evento
			</Button>
			<Modal
				status={resetModalState.status}
				toggleVisibility={() => setResetModalState({ status: false })}
				headerProps={{
					icon: (
						<ResetIcon
							color="var(--neutral)"
							width={"2.4rem"}
							height={"2.4rem"}
						/>
					),
					title:
						resetModalState.headerProps?.title ||
						`Você tem certeza que deseja reiniciar o evento?`,
					description:
						resetModalState.headerProps?.description ||
						"Ao reiniciar um evento, os convidados permanecerão os mesmos, mas os resultados serão apagados.\n\nAlém disso, novos convidados poderão ser adicionados.",
				}}
				buttons={[
					{
						text: "Sim, desejo reiniciar o evento",
						style: {
							width: "100%",
						},
						type: "button",
						onClick: resetEvent,
					},
				]}
			/>
		</Fragment>
	);
}
