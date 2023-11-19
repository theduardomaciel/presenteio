"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

// Styling
import styles from "./styles.module.css";

// Icons
import AddIcon from "@/public/icons/add.svg";
import MailIcon from "@/public/icons/mail.svg";
import EditFilledIcon from "@/public/icons/edit_filled.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import WarningIcon from "@/public/icons/warning1.svg";

// Components
import Button from "components/_ui/Button";
import EmptyGuests from "@/dashboard/components/Guest/EmptyGuests";
import DashboardSectionHeader from "@/dashboard/components/Section/SectionHeader";
import GuestModal, {
	type PartialGuest,
} from "@/dashboard/components/Guest/GuestModal";

const MAX_GUESTS = 30;

interface PartialGuestPreviewProps {
	guest: PartialGuest;
	setPartialGuests: Dispatch<SetStateAction<PartialGuest[]>>;
	onEdit: () => void;
}

const PartialGuestPreview = ({
	guest,
	setPartialGuests,
	onEdit,
}: PartialGuestPreviewProps) => {
	const handleDelete = () => {
		setPartialGuests((prev) => prev.filter((g) => g.name !== guest.name));
	};

	return (
		<div
			className={
				"flex flex-row items-center justify-between gap-[1.5rem] w-full"
			}
		>
			<button className={styles.guestPreview} onClick={onEdit}>
				<div className={styles.guestInfo}>
					{guest.image_url && guest.image_url.includes("http") && (
						<Image
							src={guest.image_url}
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
					<EditFilledIcon />
				</div>
			</button>
			<DeleteIcon
				width={24}
				height={24}
				color="var(--primary-02)"
				className="cursor-pointer"
				onClick={handleDelete}
			/>
		</div>
	);
};

interface GuestsDisplayProps {
	partialGuests: PartialGuest[];
	setPartialGuests: Dispatch<SetStateAction<PartialGuest[]>>;
	hasAddButton?: boolean;
}

export default function PartialGuestsDisplay({
	partialGuests,
	setPartialGuests,
	hasAddButton,
}: GuestsDisplayProps) {
	const [currentPartialGuest, setCurrentPartialGuest] = useState<
		PartialGuest | undefined
	>(undefined);
	const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

	const toggleVisibility = () => {
		if (isGuestModalVisible) {
			setCurrentPartialGuest(undefined);
		}
		setIsGuestModalVisible(!isGuestModalVisible);
	};

	const onSubmit = (guest: PartialGuest) => {
		if (currentPartialGuest) {
			setPartialGuests((prev) =>
				prev.map((g) => {
					if (g.name === currentPartialGuest.name) {
						return guest;
					}
					return g;
				})
			);
		} else {
			setPartialGuests((prev) => [...prev, guest]);
		}
		toggleVisibility();
	};

	return (
		<>
			<DashboardSectionHeader title="Participantes"></DashboardSectionHeader>
			{hasAddButton && (
				<Button
					label="Adicionar participante"
					icon={<AddIcon width={18} height={18} />}
					onClick={toggleVisibility}
					disabled={partialGuests.length > MAX_GUESTS === true}
					className="w-full"
				/>
			)}
			<div
				className={`${styles.guestsHolder} scroll ${
					partialGuests.length === 0 ? styles.empty : ""
				}`}
			>
				{/* <div className="flex bg-blue-800 w-1 h-[150rem]" /> */}
				{partialGuests.length === 0 ? (
					<EmptyGuests label="Você não adicionou nenhum convidado previamente." />
				) : (
					partialGuests.map((guest, index) => (
						<PartialGuestPreview
							key={index.toString()}
							guest={guest}
							onEdit={() => {
								setCurrentPartialGuest(guest);
								toggleVisibility();
							}}
							setPartialGuests={setPartialGuests}
						/>
					))
				)}
				{partialGuests.length >= MAX_GUESTS && (
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
				guest={currentPartialGuest}
				toggleVisibility={toggleVisibility}
				isVisible={isGuestModalVisible}
				onSubmit={onSubmit}
			/>
		</>
	);
}
