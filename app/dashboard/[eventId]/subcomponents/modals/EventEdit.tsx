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
import DashboardPricePicker from "@/dashboard/components/Event/PricePicker";
import EventDisplay from "@/dashboard/components/Event/EventDisplay";

import { InviteOptions } from "app/dashboard/compose/Form";

// Utils
import { type Event } from "@prisma/client";

interface Props {
	event?: Omit<Event, "createdAt">;
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

		const data = {
			allowInvite: form.get("allowInvite") === "on",
			allowProfileChange: form.get("allowProfileChange") === "on",
			minPrice: form.get("min"),
			maxPrice: form.get("max"),
		};

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

	function onFormChange(formEvent: React.FormEvent<HTMLFormElement>) {
		const form = new FormData(formEvent.currentTarget);

		const data = {
			allowInvite: form.get("allowInvite") === "on",
			allowProfileChange: form.get("allowProfileChange") === "on",
			minPrice: form.get("min") || undefined,
			maxPrice: form.get("max") || undefined,
			color: form.get("accentColor"),
		};

		const eventData = {
			allowInvite: event?.allowInvite,
			allowProfileChange: event?.allowProfileChange,
			minPrice: event?.minPrice?.toString() || undefined,
			maxPrice: event?.maxPrice?.toString() || undefined,
			color: event?.color,
		};

		//console.log(data, eventData);

		if (JSON.stringify(data) === JSON.stringify(eventData)) {
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
							<InviteOptions
								defaultValues={{
									allowInvite: event.allowInvite,
									allowProfileChange:
										event.allowProfileChange,
								}}
							/>
						</section>
						<section>
							<DashboardSectionHeader title="Regras do Evento" />
							<DashboardSubSectionHeader
								title="Margem de preço"
								description="Altere os valores de preço mínimo e/ou máximo dos presentes do evento."
							/>
							<DashboardPricePicker
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
