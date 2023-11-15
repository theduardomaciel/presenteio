"use client";
import { Suspense, useState } from "react";
import Image from "next/image";

// Styling
import styles from "./styles.module.css";

// Assets
import BackgroundPattern from "@/public/images/background_pattern.png";

import AddPhotoIcon from "@/public/icons/add_photo.svg";
import EditPhotoIcon from "@/public/icons/change.svg";
import SaveIcon from "@/public/icons/save.svg";

// Components
import Overlay from "@/dashboard/components/Overlay";
import EventThemePicker from "../ThemePicker";

// Hooks
import useImagePreview from "hooks/useImagePreview";

// Utils
import type { Event } from "@prisma/client";

interface Props {
	event?: Omit<Event, "createdAt">;
	style?: React.CSSProperties;
	className?: string;
	children?: React.ReactNode;
}

export default function EventDisplay({
	event,
	style,
	className,
	children,
}: Props) {
	const [preview, setPreview] = useState<string | undefined>(
		event?.image_url || undefined
	);

	const onSelectFile = useImagePreview(setPreview);

	return (
		<div
			className={`${className} ${styles.container}`}
			style={{ position: "relative", ...style }}
		>
			{preview ? (
				<Image
					src={preview}
					fill
					alt=""
					style={{
						borderRadius: "0.5rem",
						zIndex: 0,
						objectFit: "cover",
					}}
				/>
			) : (
				<div
					className={"imagePlaceholder"}
					style={{
						backgroundImage: `url(${BackgroundPattern.src})`,
					}}
				/>
			)}

			<Overlay />

			<label className={styles.iconHolder} htmlFor="eventImageUpload">
				{event?.image_url ? (
					<EditPhotoIcon
						color="var(--primary-01)"
						width={32}
						height={32}
					/>
				) : (
					<AddPhotoIcon
						color="var(--primary-01)"
						width={32}
						height={32}
					/>
				)}
			</label>
			<input
				type={"file"}
				onChange={onSelectFile}
				accept="image/png, image/jpeg"
				style={{ display: "none" }}
				name="eventImageUpload"
				id="eventImageUpload"
			/>

			{/* {event && (
				<Button
					className="absolute right-6 top-[1.4rem] px-3 py-1 bg-primary-03 hover:bg-primary-02 text-white border-none"
					noEffects
				>
					{isLoading ? (
						<Spinner />
					) : (
						<SaveIcon className="icon click" type="submit" />
					)}
					Salvar
				</Button>
			)} */}

			<div className="flex flex-row items-center justify-end gap-5 absolute bottom-1 right-1 lg:bottom-[1.2rem] lg:right-[1.2rem]">
				<EventThemePicker
					defaultColor={event?.color as unknown as any}
				/>
			</div>
			{children}
		</div>
	);
}
