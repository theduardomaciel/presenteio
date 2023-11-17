"use client";
import React, {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useRef,
	useState,
} from "react";
import Image from "next/image";

import styles from "./styles.module.css";

// Components
import EmptyGuests from "@/dashboard/components/Guest/EmptyGuests";
import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import Button from "components/_ui/Button";
import GuestModal from "@/dashboard/components/Guest/GuestModal";

// Icons
import MailIcon from "@/public/icons/mail.svg";
import AddIcon from "@/public/icons/add.svg";
import EditFilledIcon from "@/public/icons/edit_filled.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import WarningIcon from "@/public/icons/warning1.svg";

const MAX_GUESTS = 5;

interface Props {
	preGuests: PreGuest[];
	setPreGuests: Dispatch<SetStateAction<PreGuest[]>>;
	hasAddButton?: boolean;
}

export interface PreGuest {
	name: string;
	email?: string;
	image?: File;
	imagePreview?: string;
}

interface AddGuestButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	setIsGuestModalVisible: Dispatch<SetStateAction<boolean>>;
	className?: string;
	style?: React.CSSProperties;
}

export const AddGuestButton = ({
	setIsGuestModalVisible,
	className,
	style,
	...rest
}: AddGuestButtonProps) => (
	<Button
		label="Adicionar participante"
		icon={<AddIcon />}
		onClick={() => {
			setIsGuestModalVisible(true);
		}}
		disabled={rest["aria-disabled"] === true}
		className={className}
		style={{
			paddingBlock: "0.5rem",
			...style,
		}}
		{...rest}
	/>
);

interface PreGuestPreviewProps {
	guest: PreGuest;
	setCurrentPreGuest: Dispatch<SetStateAction<PreGuest>>;
	toggleVisibility: () => void;
	setPreGuests: Dispatch<SetStateAction<PreGuest[]>>;
}

const PreGuestPreview = ({
	guest,
	setCurrentPreGuest,
	toggleVisibility,
	setPreGuests,
}: PreGuestPreviewProps) => {
	const handleDelete = () => {
		setPreGuests((prev) => prev.filter((g) => g.name !== guest.name));
	};

	return (
		<div
			className={
				"flex flex-row items-center justify-between gap-[1.5rem] w-full"
			}
		>
			<div
				className={styles.guestPreview}
				onClick={() => {
					setCurrentPreGuest(guest);
					toggleVisibility();
				}}
			>
				<div className={styles.guestInfo}>
					{guest.imagePreview &&
						guest.imagePreview.includes("http") && (
							<Image
								src={guest.imagePreview}
								style={{
									borderRadius: "50%",
									objectFit: "cover",
									aspectRatio: "1/1",
									minHeight: 28,
									minWidth: 28,
								}}
								width={28}
								height={28}
								alt={guest.name}
							/>
						)}
					<p>{guest.name}</p>
					<div
						className="divisor"
						style={{
							borderColor: "var(--neutral)",
							width: 1,
							height: "1.5rem",
							opacity: 0.7,
						}}
					/>
					<div className={styles.iconHolder}>
						<MailIcon />
						<span>{guest.email ? guest.email : "[pendente]"}</span>
					</div>
				</div>
				<div className={styles.actions}>
					<EditFilledIcon
						onClick={() => {
							setCurrentPreGuest(guest);
							toggleVisibility();
						}}
					/>
				</div>
			</div>
			<DeleteIcon
				width={24}
				height={24}
				fill="var(--primary-02)"
				className="cursor-pointer"
				onClick={handleDelete}
			/>
		</div>
	);
};

export default function GuestsDisplay({
	preGuests,
	setPreGuests,
	hasAddButton,
}: Props) {
	const [currentPreGuest, setCurrentPreGuest] = useState<
		PreGuest | undefined
	>(undefined);
	const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

	const toggleVisibility = () => {
		if (isGuestModalVisible) {
			//console.log("Limpando currentPreGuest");
			setCurrentPreGuest(undefined);
		}
		setIsGuestModalVisible(!isGuestModalVisible);
	};

	return (
		<>
			<DashboardSectionHeader title="Participantes"></DashboardSectionHeader>
			{hasAddButton && (
				<AddGuestButton
					setIsGuestModalVisible={setIsGuestModalVisible}
					aria-disabled={preGuests.length >= MAX_GUESTS}
					className="w-full"
				/>
			)}
			<div
				className={`${styles.guestsHolder} scroll ${
					preGuests.length === 0 ? styles.empty : ""
				}`}
			>
				{/* <div className="flex bg-blue-800 w-1 h-96" /> */}
				{preGuests.length === 0 ? (
					<EmptyGuests
						label="Você não adicionou nenhum convidado previamente."
						style={{ paddingBlock: "5rem" }}
					/>
				) : (
					preGuests.map((guest, index) => (
						<PreGuestPreview
							key={index.toString()}
							guest={guest}
							toggleVisibility={toggleVisibility}
							setCurrentPreGuest={setCurrentPreGuest}
							setPreGuests={setPreGuests}
						/>
					))
				)}
				{preGuests.length >= 5 && (
					<div className="flex flex-row items-center justify-center w-full h-full gap-4 pt-2 text-primary-02">
						<WarningIcon width={24} height={24} />
						<p className="text-base">
							Você atingiu o limite de {MAX_GUESTS} convidados.{" "}
							<br />
							Caso deseje aumentar esse limite, entre em contato
							conosco.
						</p>
					</div>
				)}
			</div>
			<GuestModal
				isVisible={isGuestModalVisible}
				modalProps={{
					preGuest: currentPreGuest,
					setPreGuests: setPreGuests,
				}}
				toggleVisibility={toggleVisibility}
			/>
		</>
	);
}
