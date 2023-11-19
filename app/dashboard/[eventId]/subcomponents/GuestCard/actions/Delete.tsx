import React, { Fragment, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Icons
import DeleteIcon from "@/public/icons/delete.svg";

// Components
import Modal from "components/Modal";

// Types
import type { ModalProps } from "components/Modal";
import { ToastDynamicProps } from "components/_ui/Toast";

interface Props {
	guestId: string;
	setToastVisible: React.Dispatch<SetStateAction<ToastDynamicProps>>;
}

export default function DeleteGuest({ guestId, setToastVisible }: Props) {
	const router = useRouter();

	const [deleteModalState, setDeleteModalState] = useState<ModalProps>({
		status: false,
	});

	async function deleteGuest() {
		setDeleteModalState({ status: "pending" });
		try {
			await axios.delete(`/api/guests/${guestId}`);
			setDeleteModalState({ status: false });
			setToastVisible([
				true,
				{
					icon: (
						<DeleteIcon
							color="var(--primary-01)"
							width={36}
							height={36}
						/>
					),
					title: "Convidado removido!",
					description:
						"O convidado foi removido do evento com sucesso!",
				},
			]);
			router.refresh();
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

	return (
		<Fragment>
			<DeleteIcon
				color="white"
				width={22}
				height={22}
				onClick={() => setDeleteModalState({ status: true })}
			/>
			<Modal
				status={deleteModalState.status}
				toggleVisibility={() => setDeleteModalState({ status: false })}
				headerProps={{
					icon: (
						<DeleteIcon
							color="white"
							width={"2.4rem"}
							height={"2.4rem"}
						/>
					),
					title:
						deleteModalState.headerProps?.title ||
						`Você tem certeza que deseja remover o convidado?`,
					description:
						deleteModalState.headerProps?.description ||
						`Após remover o convidado, ele não será mais capaz de acessar o evento. Essa ação não pode ser desfeita.`,
				}}
				returnButton={{
					enabled:
						deleteModalState.status !== "pending" ? true : false,
				}}
				buttons={[
					{
						text: "Sim, desejo remover o convidado",
						style: { width: "100%" },
						onClick: deleteGuest,
					},
				]}
			/>
		</Fragment>
	);
}
