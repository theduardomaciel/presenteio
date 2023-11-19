"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

// Assets
import AddIcon from "@/public/icons/add.svg";

// Components
import Button from "components/_ui/Button";
import GuestModal, {
	PartialGuest,
} from "@/dashboard/components/Guest/GuestModal";

// Utils
import { toBase64 } from "@/utils/image";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
	eventId: string;
}

export default function GuestAdd({ eventId, ...props }: Props) {
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const toggleVisibility = () => setIsVisible((prev) => !prev);

	async function onSubmit(guest: PartialGuest) {
		setIsLoading(true);

		const image_base64 = guest.image_file
			? await toBase64(guest.image_file)
			: null;

		const newGuest = {
			eventId: eventId,
			name: guest.name,
			email: guest.email,
			image_base64: image_base64,
		};

		try {
			await axios.post(`/api/guests`, newGuest);
			router.refresh();
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}

		setIsLoading(false);
	}

	return (
		<>
			<Button
				icon={<AddIcon width={18} height={18} />}
				onClick={toggleVisibility}
				disabled={props["aria-disabled"] === true}
				suppressEffects={true}
				{...props}
			>
				<p className="hidden lg:flex">Adicionar participante</p>
			</Button>
			<GuestModal
				isVisible={isVisible}
				isLoading={isLoading}
				toggleVisibility={toggleVisibility}
				onSubmit={onSubmit}
			/>
		</>
	);
}
