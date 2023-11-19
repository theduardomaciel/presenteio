"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Icons
import DeleteIcon from "@/public/icons/delete.svg";

// Components
import Modal, { ModalProps } from "components/Modal";
import Button from "components/_ui/Button";

interface Props {
	eventId?: string;
}

export default function EventDeleteModal({ eventId }: Props) {
	const router = useRouter();

	const [isLoading, setLoading] = useState(false);
	const [deleteModalState, setDeleteModalState] = useState<ModalProps>({
		status: false,
	});

	async function deleteEvent() {
		setLoading(true);
		setDeleteModalState({
			status: "pending",
			headerProps: {
				description:
					"Estamos excluindo o evento e todos os seus dados.",
			},
		});

		try {
			const response = await axios.delete(`/api/events/${eventId}`);
			if (response) {
				router.replace(`/dashboard`);
				router.refresh();
			} else {
				setDeleteModalState({
					status: "error",
					headerProps: {
						description:
							"Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde.",
					},
				});
			}
		} catch (error) {
			console.log(error);
			setDeleteModalState({
				status: "error",
				headerProps: {
					description:
						"Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde.",
				},
			});
		}
	}

	if (!eventId) {
		return null;
	}

	return (
		<Fragment>
			<Button
				type="button"
				style={{
					paddingInline: "1.4rem",
					width: "fit-content",
				}}
				onClick={() => {
					setDeleteModalState({ status: true });
				}}
			>
				<DeleteIcon color="var(--neutral)" width={18} height={18} />
			</Button>
			<Modal
				status={deleteModalState.status}
				toggleVisibility={() => setDeleteModalState({ status: false })}
				headerProps={{
					icon: (
						<DeleteIcon
							color="var(--neutral)"
							width={"2.4rem"}
							height={"2.4rem"}
						/>
					),
					title:
						deleteModalState.headerProps?.title ||
						`Você tem certeza que deseja excluir o evento?`,
					description: deleteModalState.headerProps?.description,
				}}
				buttons={[
					{
						text: "Sim, desejo excluir o evento",
						style: {
							width: "100%",
						},
						type: "button",
						onClick: deleteEvent,
					},
				]}
			/>
		</Fragment>
	);
}
