"use client";

import { Fragment, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Styling
import styles from "../../styles.module.css";
import { DISABLED_BUTTON, ENABLED_BUTTON } from "../styles";

// Icons
import SaveIcon from "@/public/icons/save.svg";
import SettingsIcon from "@/public/icons/settings.svg";

// Components
import Modal, { ModalProps } from "components/Modal";
import Button from "components/_ui/Button";
import Spinner from "components/_ui/Spinner";

import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import DashboardSubSectionHeader from "@/dashboard/components/Section/SubSectionHeader";
import EventPricePicker from "@/dashboard/components/Event/PricePicker";
import EventDisplay from "@/dashboard/components/Event/EventDisplay";
import EventInviteOptions from "@/dashboard/components/Event/InviteOptions";

// Utils
import { type Event } from "@prisma/client";
import { toBase64 } from "@/utils/image";

interface Props {
	event?: Omit<Event, "createdAt"> & { guestsWithoutEmail: number };
}

export default function EventEditModal({ event }: Props) {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement | null>(null);

	const [isLoading, setLoading] = useState(false);
	const [editEventModalState, setEditEventModalState] = useState<ModalProps>({
		status: false,
	});

	async function onSubmitEdit(formEvent: React.FormEvent<HTMLFormElement>) {
		formEvent.preventDefault();
		setEditEventModalState((previousState) => ({
			...previousState,
			status: "pending",
		}));

		const form = new FormData(formEvent.currentTarget);

		const eventImage = form.get("eventImageUpload") as File;
		const image_base64 = eventImage
			? await toBase64(eventImage)
			: undefined;

		const data = {
			allowInvite: form.get("allowInvite") === "on",
			allowProfileChange: form.get("allowProfileChange") === "on",
			allowEmailChange: form.get("allowEmailChange") === "on",
			allowRevealFromPage: form.get("allowRevealFromPage") === "on",
			minPrice: form.get("min"),
			maxPrice: form.get("max"),
			color: form.get("accentColor"),
			image_base64: image_base64,
		} as Partial<Event> & { image_base64?: string };

		try {
			await axios.patch(`/api/events/${event?.id}`, data);

			setEditEventModalState({
				status: "success",
				headerProps: {
					description: "O evento atualizado com sucesso!",
				},
			});

			setLoading(false);
			setHasChanges(false);

			router.refresh();
		} catch (error) {
			console.log(error);
			setLoading(false);
			setHasChanges(false);

			setEditEventModalState({
				status: "error",
				headerProps: {
					description:
						"Um erro interno nos impediu de atualizar o evento. Por favor, tente novamente mais tarde.",
				},
			});
		}
	}

	const [hasChanges, setHasChanges] = useState(false);

	async function onFormChange(formEvent: React.FormEvent<HTMLFormElement>) {
		const form = new FormData(formEvent.currentTarget);
		const eventImage = form.get("eventImageUpload") as File;

		// Temos que fazer isso pois algumas partes do formulário podem ser ocultadas do usuário caso o evento já tenha sido divulgado
		const allowInvite = form.get("allowInvite");
		const allowRevealFromPage = form.get("allowRevealFromPage");
		const allowProfileChange = form.get("allowProfileChange");
		const allowEmailChange = form.get("allowEmailChange");

		const data = {
			allowInvite: allowInvite
				? form.get("allowInvite") === "on"
				: event?.allowInvite,
			allowRevealFromPage: allowRevealFromPage
				? allowRevealFromPage === "on"
				: event?.allowRevealFromPage,
			allowProfileChange: allowProfileChange
				? form.get("allowProfileChange") === "on"
				: event?.allowProfileChange,
			allowEmailChange: allowEmailChange
				? form.get("allowEmailChange") === "on"
				: event?.allowEmailChange,
			minPrice: form.get("min") || undefined,
			maxPrice: form.get("max") || undefined,
			color: form.get("accentColor") || "RED",
		};

		const eventData = {
			allowInvite: event?.allowInvite,
			allowRevealFromPage: event?.allowRevealFromPage,
			allowProfileChange: event?.allowProfileChange,
			allowEmailChange: event?.allowEmailChange,
			minPrice: event?.minPrice?.toString() || undefined,
			maxPrice: event?.maxPrice?.toString() || undefined,
			color: event?.color,
		};

		//console.log(data, eventData);

		if (
			JSON.stringify(data) === JSON.stringify(eventData) &&
			eventImage?.size === 0
		) {
			setHasChanges(false);
		} else {
			setHasChanges(true);
		}
	}

	if (!event) {
		return null;
	}

	return (
		<Fragment>
			<Button
				style={{ width: "100%", ...ENABLED_BUTTON }}
				onClick={() => setEditEventModalState({ status: true })}
			>
				<SettingsIcon height={24} width={24} />
				Editar evento
			</Button>
			<Modal
				status={editEventModalState.status}
				toggleVisibility={() => {
					setEditEventModalState({ status: false });
					formRef.current?.reset();
					setHasChanges(false);
				}}
				headerProps={{
					icon: <SettingsIcon width={"2.4rem"} height={"2.4rem"} />,
					title:
						editEventModalState.headerProps?.title ||
						"Editar Evento",
					description: editEventModalState.headerProps?.description,
					integratedTitle: true,
				}}
				returnButton={{
					enabled: true,
					text:
						editEventModalState.status === true
							? "Cancelar"
							: "Fechar",
					onClick: () => setEditEventModalState({ status: false }),
				}}
			>
				{editEventModalState.status === true ? (
					<form
						ref={formRef}
						onSubmit={onSubmitEdit}
						onChange={onFormChange}
						className={styles.form}
					>
						<section>
							<DashboardSectionHeader title="Customização" />
							<EventDisplay
								event={event}
								className="min-h-[17.5rem]"
							/>
						</section>
						<section>
							<DashboardSectionHeader title="Configurações de convite" />
							<EventInviteOptions
								defaultValues={{
									allowInvite: event.allowInvite,
									allowRevealFromPage:
										event.allowRevealFromPage,
									allowProfileChange:
										event.allowProfileChange,
									allowEmailChange: event.allowEmailChange,
								}}
								hasEventBeenDivulged={
									event.status === "DIVULGED"
								}
								hasGuestsWithoutEmail={
									event.guestsWithoutEmail > 0
								}
							/>
						</section>
						<section>
							<DashboardSectionHeader title="Regras do Evento" />
							<DashboardSubSectionHeader
								title="Margem de preço"
								description="Altere os valores de preço mínimo e/ou máximo dos presentes do evento."
							/>
							<EventPricePicker
								defaultValues={{
									min: event.minPrice || 0,
									max: event.maxPrice || 0,
								}}
							/>
						</section>
						<Button
							isLoading={isLoading}
							disabled={!hasChanges}
							type="submit"
							className="w-full"
							style={
								hasChanges ? ENABLED_BUTTON : DISABLED_BUTTON
							}
						>
							<SaveIcon />
							Salvar
						</Button>
					</form>
				) : editEventModalState.status === "pending" ? (
					<Spinner />
				) : null}
			</Modal>
		</Fragment>
	);
}
