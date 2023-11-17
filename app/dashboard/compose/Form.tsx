"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "../dashboard.module.css";

// Components
import Button from "components/_ui/Button";
import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import DashboardSubSectionHeader from "@/dashboard/components/Section/SubSectionHeader";
import EventPricePicker from "@/dashboard/components/Event/PricePicker";
import EventDisplay from "@/dashboard/components/Event/EventDisplay";
import EventInviteOptions from "@/dashboard/components/Event/InviteOptions";
import GuestsDisplay, {
	PreGuest,
} from "app/dashboard/compose/PreGuestsDisplay";
import Modal, { ModalProps } from "components/Modal";

// Icons
import AddIcon from "@/public/icons/add.svg";
import UploadIcon from "@/public/icons/upload.svg";

// Utils
import { toBase64 } from "@/utils/image";

export default function ComposeEventForm({
	children,
}: {
	children: React.ReactNode;
}) {
	const [confirmModalState, setConfirmModalState] = useState<ModalProps>({
		status: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [preGuests, setPreGuests] = useState<PreGuest[]>([]);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (confirmModalState.status === true) {
			setIsLoading(true);
			setConfirmModalState({
				status: "pending",
				headerProps: {
					title: "Aguarde um momento...",
					description:
						"Estamos criando seu evento, isso pode demorar um pouco.",
				},
			});
			const form = new FormData(event.currentTarget);

			const eventImage = form.get("eventImageUpload") as File;
			const image_base64 = eventImage
				? await toBase64(eventImage)
				: undefined;

			const guestsWithImage = await Promise.all(
				Array.from(preGuests).map(async (guest) => {
					if (guest.image) {
						guest.imagePreview =
							(await toBase64(guest.image)) || undefined;
					}
					return guest;
				})
			);

			const data = {
				name: form.get("eventName") || "Novo evento",
				allowInvite: form.get("allowInvite"),
				allowProfileChange: form.get("allowProfileChange"),
				allowEmailChange: form.get("allowEmailChange"),
				allowRevealFromPage: form.get("allowRevealFromPage"),
				minPrice: form.get("min"),
				maxPrice: form.get("max"),
				image_base64: image_base64,
				guests: guestsWithImage,
				color: form.get("accentColor"),
			};

			try {
				const response = await axios.post(`/api/events`, data);
				if (response) {
					console.log(response.data);
					setConfirmModalState({
						status: "success",
						data: response.data.id,
						headerProps: {
							title: "Evento criado com sucesso!",
							description: `Eba! Seu evento foi criado com sucesso!\n 
                    Agora é só enviar o convite geral ou os convites personalizados para os convidados e aproveitar o momento!`,
						},
					});
				} else {
					setConfirmModalState({
						status: "error",
						headerProps: {
							title: "Não foi possível criar seu evento.",
							description: `Não foi possível obter uma resposta de nossos servidores acerca de seu evento. Por favor, tente novamente.`,
						},
					});
				}
				setIsLoading(false);
			} catch (error: any) {
				console.log(error);
				setConfirmModalState({
					status: "error",
					headerProps: {
						title: "Opa! Nos deparamos com um problema.",
						description: `Não foi possível criar seu evento. Por favor, tente novamente.`,
					},
				});
				setIsLoading(false);
			}
		}
	}

	const router = useRouter();

	return (
		<form onSubmit={onSubmit} style={{ width: "100%" }}>
			{children}
			<div className={`${styles.content} ${styles.row}`}>
				<div className={styles.column}>
					<div
						className={`${styles.section} ${styles.middle}`}
						style={{ gap: "1.35rem" }}
					>
						<GuestsDisplay
							preGuests={preGuests}
							setPreGuests={setPreGuests}
							hasAddButton
						/>
					</div>
					<div className={styles.section}>
						<DashboardSectionHeader title="Configurações de Convite" />
						<EventInviteOptions />
					</div>
				</div>
				<div className={styles.column}>
					<div className={styles.section}>
						<DashboardSectionHeader title="Regras do Evento" />
						<DashboardSubSectionHeader
							title="Margem de preço"
							description="Determine se os presentes possuirão preço mínimo e/ou máximo."
						/>
						<EventPricePicker fixedWidth />
					</div>
					<div className={styles.section} style={{ height: "100%" }}>
						<DashboardSectionHeader title="Personalização" />
						<EventDisplay style={{ height: "100%" }} />
					</div>
					<Button
						type="button"
						onClick={() => setConfirmModalState({ status: true })}
						style={{ width: "100%" }}
					>
						<AddIcon />
						Criar Evento
					</Button>
				</div>
			</div>
			<Modal
				status={confirmModalState.status}
				toggleVisibility={() => setConfirmModalState({ status: false })}
				headerProps={{
					insertLogo: true,
					title:
						confirmModalState.headerProps?.title ||
						"Pronto para criar o evento?",
					description:
						confirmModalState.headerProps?.description ||
						`Confira todas as informações antes de criá-lo para que todos os convidados tenham a experiência desejada desde o início.\n
                Não se preocupe pois nenhum convidado será notificado até que todos tenham confirmado presença.`,
				}}
				returnButton={{
					enabled:
						confirmModalState.status !== "success" &&
						confirmModalState.status !== "pending"
							? true
							: false,
				}}
				buttons={
					confirmModalState.status === "success"
						? [
								{
									text: "Ir para o Evento",
									onClick:
										confirmModalState.status === "success"
											? () =>
													router.replace(
														`/dashboard/${confirmModalState.data}`
													)
											: undefined,
								},
						  ]
						: []
				}
			>
				{confirmModalState.status === true && (
					<Button
						type="submit"
						isLoading={isLoading}
						style={{
							width: "100%",
							padding: "1rem 2.5rem",
							gap: "1.5rem",
							backgroundColor: "var(--primary-01)",
						}}
					>
						Criar Evento
						<UploadIcon />
					</Button>
				)}
			</Modal>
		</form>
	);
}
