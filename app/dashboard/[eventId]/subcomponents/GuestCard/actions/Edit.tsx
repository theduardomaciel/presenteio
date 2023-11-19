import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Icons
import EditIcon from "@/public/icons/edit.svg";

// Components
import GuestModal, {
	PartialGuest,
} from "@/dashboard/components/Guest/GuestModal";

// Utils;
import { toBase64 } from "@/utils/image";

// Types
import { type ToastDynamicProps } from "components/_ui/Toast";
import type { Guest } from "@prisma/client";

interface Props {
	guest: Omit<Guest, "event">;
	setToastVisible: React.Dispatch<React.SetStateAction<ToastDynamicProps>>;
}

export default function EditGuest({ guest, setToastVisible }: Props) {
	const router = useRouter();

	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(guestFromSubmit: PartialGuest) {
		setIsLoading(true);

		const image_base64 = guestFromSubmit.image_file
			? await toBase64(guestFromSubmit.image_file)
			: null;

		const editedGuest = {
			name: guestFromSubmit.name,
			email: guestFromSubmit.email,
			image_base64: image_base64,
		};

		try {
			await axios.patch(`/api/guests/${guest?.id}`, editedGuest);

			setToastVisible([
				true,
				{
					icon: (
						<EditIcon
							color="var(--primary-01)"
							width={36}
							height={36}
						/>
					),
					title: "Tudo certo!",
					description:
						"Os dados do convidado foram editados com sucesso.",
				},
			]),
				router.refresh();
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}

		setIsLoading(false);
	}

	return (
		<Fragment>
			<EditIcon
				color="var(--neutral)"
				width={22}
				height={22}
				onClick={() => setIsEditModalVisible(true)}
			/>
			<GuestModal
				isVisible={isEditModalVisible}
				guest={guest}
				onSubmit={onSubmit}
				isLoading={isLoading}
				toggleVisibility={() =>
					setIsEditModalVisible(!isEditModalVisible)
				}
			/>
		</Fragment>
	);
}
