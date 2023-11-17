"use client";
import {
	CSSProperties,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const { onSelectFile, setPreview, preview } = useImagePreview(
		modalProps?.guest?.image_url || undefined
	);

	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	const [name, setName] = useState(modalProps?.guest?.name || "");
	const [email, setEmail] = useState(modalProps?.guest?.email || "");

	async function onSubmit() {
		if (!name) return alert("O nome é obrigatório");

		if (modalProps?.setPreGuests) {
			if (modalProps && modalProps.preGuest) {
				// editing a preGuest
				modalProps.setPreGuests((prev) => {
					let newPreGuests = [...prev];
					newPreGuests[
						prev.indexOf(modalProps.preGuest as PreGuest)
					] = {
						name: name,
						email: email,
						imagePreview: preview,
						image: imageInputRef.current?.files?.[0] as File,
					};
					return newPreGuests;
				});
			} else {
				// adding a preGuest
				modalProps.setPreGuests((prev) =>
					prev.concat({
						name: name,
						email: email,
						imagePreview: preview,
						image: imageInputRef.current?.files?.[0] as File,
					})
				);
			}
			cleanUp();
		} else if (modalProps?.guest) {
			setLoading(true);

			const image = imageInputRef.current?.files?.[0] as File;
			const image_base64 = image ? await toBase64(image) : null;

			const guest = {
				name: name,
				email: email,
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

			const image = imageInputRef.current?.files?.[0] as File;
			const image_base64 = image ? await toBase64(image) : null;

			//console.log(image);
			//console.log(image_base64);

			const guest = {
				eventId: modalProps.eventId,
				name: name,
				email: email,
				image_base64: image_base64,
			};

			try {
				await axios.post(`/api/guests`, guest);
				cleanUp();
				router.refresh();
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		}
	}

	const hasChanges = useMemo(() => {
		if (modalProps?.guest) {
			/* console.log(
				name,
				modalProps?.guest?.name,
				name !== modalProps?.guest?.name
			);
			console.log(
				email,
				modalProps?.guest?.email ?? "",
				email !== modalProps?.guest?.email
			);
			console.log(
				preview,
				modalProps?.guest?.image_url,
				preview !== modalProps?.guest?.image_url &&
					preview !== undefined
			); */

			return (
				name !== modalProps?.guest?.name ||
				email !== (modalProps?.guest?.email ?? "") ||
				(preview !== modalProps?.guest?.image_url &&
					preview !== undefined)
			);
		}
	}, [name, email, preview]);

	const cleanUp = () => {
		setLoading(false);
		imageInputRef.current?.value && (imageInputRef.current.value = "");
		setPreview(modalProps?.guest?.image_url || undefined);
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
			<div className="flex flex-col items-center justify-start gap-5 w-full">
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
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					id="guestEmail"
					minLength={8}
					type={"email"}
				/>
				<Button
					onClick={onSubmit}
					isLoading={isLoading}
					disabled={modalProps?.guest ? !hasChanges : !name}
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
			</div>
		</Modal>
	);
}

export default GuestModal;
