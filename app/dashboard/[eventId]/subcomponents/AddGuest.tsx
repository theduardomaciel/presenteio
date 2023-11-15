"use client";
import { useState } from "react";

import GuestModal from "@/dashboard/components/Guest/GuestModal";
import { AddGuestButton } from "app/dashboard/compose/PreGuestsDisplay";

interface Props {
	eventId: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function AddGuest({ eventId, className, style }: Props) {
	const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

	return (
		<>
			<AddGuestButton
				setIsGuestModalVisible={setIsGuestModalVisible}
				className={className}
				style={style}
			/>
			<GuestModal
				isVisible={isGuestModalVisible}
				modalProps={{ eventId: eventId }}
				toggleVisibility={() =>
					setIsGuestModalVisible(!isGuestModalVisible)
				}
			/>
		</>
	);
}
