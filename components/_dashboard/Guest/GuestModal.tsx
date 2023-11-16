"use client";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

// Components
import Button from "components/_ui/Button";
import Modal from "components/Modal";
import Input from "components/_ui/Input";
import { PreGuest } from "app/dashboard/compose/PreGuestsDisplay";

// Icons
import UserIcon from "@/public/icons/person.svg";
import AddPhotoIcon from "@/public/icons/add_photo.svg";
import GroupAddIcon from "@/public/icons/group_add.svg";
import EditFilledIcon from "@/public/icons/edit_filled.svg";

// Types
import type { Guest } from "@prisma/client";

// Hooks
import useImagePreview from "hooks/useImagePreview";

import { toBase64 } from "@/utils/image";

export const GUEST_IMAGE_PLACEHOLDER = {
	width: "13rem",
	height: "13rem",
	borderRadius: "50%",
	backgroundColor: "var(--primary-02)",
	display: "flex",
	objectFit: "cover",
	justifyContent: "center",
	position: "relative",
	alignItems: "center",
	cursor: "pointer",
} as CSSProperties;

interface Props {
	isVisible: boolean;
	modalProps?: {
		eventId?: string; // for adding a guest
		guest?: Guest; // for editing a guest
		postFunction?: () => void;
		preGuest?: PreGuest; // for editing a preGuest
		setPreGuests?: React.Dispatch<React.SetStateAction<PreGuest[]>>; // for adding a preGuest
	};
	toggleVisibility: () => void;
}

// código do preview de imagem: https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react

function GuestModal({ isVisible, modalProps, toggleVisibility }: Props) {
	const formRef = useRef<HTMLFormElement | null>(null);

	const { onSelectFile, setPreview, preview } = useImagePreview(
		modalProps?.guest?.image_url || undefined
	);

	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		if (modalProps?.setPreGuests) {
			const name = data.get("guestName") as string;
			const email = data.get("guestEmail") as string;

			if (modalProps && modalProps.preGuest) {
				modalProps.setPreGuests((prev) => {
					let newPreGuests = [...prev];
					newPreGuests[
						prev.indexOf(modalProps.preGuest as PreGuest)
					] = {
						name: name,
						email: email,
						imagePreview: preview,
					};
					return newPreGuests;
				});
			} else {
				modalProps.setPreGuests((prev) =>
					prev.concat({
						name: name,
						email: email,
						imagePreview: preview,
					})
				);
			}
			cleanUp();
		} else if (modalProps?.guest) {
			setLoading(true);

			const image = data.get("guestImageUpload") as File;
			const image_base64 = image ? await toBase64(image) : null;

			const guest = {
				name: data.get("guestName"),
				email: data.get("guestEmail"),
				image_deleteHash: modalProps.guest.image_deleteHash,
				image_base64: image_base64,
			};

			try {
				await axios.patch(`/api/guests/${modalProps.guest.id}`, guest);
				cleanUp();
				router.refresh();
				modalProps.postFunction && modalProps.postFunction();
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		} else if (modalProps?.eventId) {
			setLoading(true);

			const image = data.get("guestImageUpload") as File;
			const image_base64 = image ? await toBase64(image) : null;

			const guest = {
				eventId: modalProps.eventId,
				name: data.get("guestName"),
				email: data.get("guestEmail"),
				image_base64: image_base64,
			};

			try {
				const response = await axios.post(`/api/guests`, guest);
				cleanUp();
				router.refresh();
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		}
	}

	const [hasChanges, setHasChanges] = useState(false);

	async function onFormChange(formEvent: React.FormEvent<HTMLFormElement>) {
		const data = new FormData(formEvent.currentTarget);
		const guestImage = data.get("guestImageUpload") as File;

		const guest = {
			name: data.get("guestName"),
			email: data.get("guestEmail") || undefined,
		};

		const initialGuest = {
			name: modalProps?.guest?.name,
			email: modalProps?.guest?.email || undefined,
		};

		console.log(guest, initialGuest);

		if (
			JSON.stringify(guest) === JSON.stringify(initialGuest) &&
			guestImage?.size === 0
		) {
			setHasChanges(false);
		} else {
			setHasChanges(true);
		}
	}

	const cleanUp = () => {
		setLoading(false);
		setHasChanges(false);
		setPreview(undefined);
		formRef.current?.reset();

		toggleVisibility();
	};

	return (
		<Modal
			status={isVisible}
			toggleVisibility={cleanUp}
			returnButton={{
				enabled: !isLoading,
			}}
			headerProps={{
				title:
					modalProps?.guest || modalProps?.preGuest
						? "Editar convidado"
						: "Adicionar convidado",
			}}
		>
			<form
				ref={formRef}
				className="flex flex-col items-center justify-start gap-5 w-full"
				onChange={modalProps?.guest ? onFormChange : undefined}
				onSubmit={onSubmit}
			>
				<label
					style={GUEST_IMAGE_PLACEHOLDER}
					htmlFor="guestImageUpload"
				>
					{preview ? (
						<Image
							src={preview}
							fill
							alt=""
							style={{ borderRadius: "50%", objectFit: "cover" }}
						/>
					) : (
						<AddPhotoIcon
							style={{ width: "4rem", height: "4rem" }}
						/>
					)}
				</label>
				<input
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
					name="guestName"
					id="guestName"
					maxLength={30}
					defaultValue={modalProps?.guest?.name || undefined}
					required
				/>
				<Input
					label="E-mail"
					name="guestEmail"
					id="guestEmail"
					minLength={8}
					type={"email"}
					defaultValue={modalProps?.guest?.email || undefined}
				/>
				<Button
					type="submit"
					isLoading={isLoading}
					disabled={modalProps?.guest ? !hasChanges : false}
					style={{ width: "100%", padding: "0.8rem 3rem" }}
				>
					{modalProps?.preGuest || modalProps?.guest ? (
						<EditFilledIcon width={"1.8rem"} height={"1.8rem"} />
					) : (
						<GroupAddIcon />
					)}
					{modalProps?.preGuest || modalProps?.guest
						? "Editar"
						: "Adicionar"}
				</Button>
			</form>
		</Modal>
	);
}

export default GuestModal;
