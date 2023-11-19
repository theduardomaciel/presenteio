"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

// Styling
import { GUEST_IMAGE_PLACEHOLDER } from "./styles";

// Components
import Button from "components/_ui/Button";
import Modal from "components/Modal";
import Input from "components/_ui/Input";

// Icons
import AddIcon from "@/public/icons/add.svg";
import AddPhotoIcon from "@/public/icons/add_photo.svg";
import GroupAddIcon from "@/public/icons/group_add.svg";
import EditFilledIcon from "@/public/icons/edit_filled.svg";

// Types
import type { Guest } from "@prisma/client";

// Hooks
import useImagePreview from "hooks/useImagePreview";

// Utils
import { toBase64 } from "@/utils/image";

export interface PartialGuest {
	id?: Guest["id"];
	name: Guest["name"];
	email?: Guest["email"];
	image_url?: Guest["image_url"];
	image_file?: File;
}

interface Props {
	isVisible: boolean;
	isLoading?: boolean;
	toggleVisibility: () => void;
	onSubmit: (guest: PartialGuest) => void;
	guest?: PartialGuest; // for editing a guest or pre-guest
}

export default function GuestModal({
	isVisible,
	isLoading,
	toggleVisibility,
	onSubmit,
	guest,
}: Props) {
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const { onSelectFile, setPreview, preview } = useImagePreview(
		guest?.image_url || undefined
	);

	const [name, setName] = useState(guest?.name || "");
	const [email, setEmail] = useState(guest?.email || "");

	const hasChanges = useMemo(() => {
		if (guest) {
			/* console.log(
				name,
				guest?.name,
				name !== guest?.name
			);
			console.log(
				email,
				guest?.email ?? "",
				email !== guest?.email
			);
			console.log(
				preview,
				guest?.image_url,
				preview !== guest?.image_url &&
					preview !== undefined
			); */

			return (
				name !== guest?.name ||
				email !== (guest?.email ?? "") ||
				(preview !== guest?.image_url && preview !== undefined)
			);
		}
	}, [name, email, preview]);

	const cleanUp = () => {
		if (!guest?.id) {
			setName("");
			setEmail("");
		}

		imageInputRef.current?.value && (imageInputRef.current.value = "");
		setPreview(guest?.image_url || undefined);

		toggleVisibility();
	};

	const onSubmitButtonClick = async () => {
		const emailInput = document.getElementById(
			"guestEmail"
		) as HTMLInputElement;
		const isValidEmail = emailInput.checkValidity();

		if (!isValidEmail) {
			emailInput.reportValidity();
			return;
		}

		const image = imageInputRef.current?.files?.[0];

		await onSubmit({
			name,
			email,
			image_url: preview ? preview : undefined,
			image_file: image,
		});

		cleanUp();
	};

	return (
		<Modal
			status={isVisible}
			toggleVisibility={cleanUp}
			returnButton={{
				enabled: !isLoading,
			}}
			headerProps={{
				title: guest ? "Editar convidado" : "Adicionar convidado",
			}}
		>
			<div className="flex flex-col items-center justify-start gap-5 w-full">
				<label
					style={{ cursor: "pointer", ...GUEST_IMAGE_PLACEHOLDER }}
					htmlFor="guestImageUpload"
				>
					{preview ? (
						<Image
							src={preview}
							fill
							alt=""
							style={{
								borderRadius: "50%",
								objectFit: "cover",
							}}
						/>
					) : (
						<AddPhotoIcon
							style={{ width: "4rem", height: "4rem" }}
							color="var(--neutral)"
						/>
					)}
				</label>
				<input
					ref={imageInputRef}
					type={"file"}
					onChange={onSelectFile}
					accept="image/png, image/jpeg"
					style={{ display: "none" }}
					id="guestImageUpload"
					name="guestImageUpload"
				/>
				<Input
					label="Nome*"
					type={"text"}
					value={name}
					onChange={(e) => setName(e.target.value)}
					name="guestName"
					id="guestName"
					maxLength={30}
					required
				/>
				<Input
					label="E-mail"
					name="guestEmail"
					id="guestEmail"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					minLength={8}
					type={"email"}
				/>
				<Button
					onClick={onSubmitButtonClick}
					isLoading={isLoading}
					disabled={guest ? !hasChanges : !name}
					style={{ width: "100%", padding: "0.8rem 3rem" }}
				>
					{guest ? (
						<EditFilledIcon width={"1.8rem"} height={"1.8rem"} />
					) : (
						<GroupAddIcon />
					)}
					{guest ? "Editar" : "Adicionar"}
				</Button>
			</div>
		</Modal>
	);
}
