'use client';
import { useState } from "react";

import GuestModal from "@dashboard/components/Guest/GuestModal";
import { AddGuestButton } from "@dashboard/components/Guest/PreGuestsDisplay";

export default function AddGuest({ eventId }: { eventId: number }) {
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

    return (
        <>
            <AddGuestButton setIsGuestModalVisible={setIsGuestModalVisible} />
            <GuestModal
                isVisible={isGuestModalVisible}
                modalProps={{ eventId: eventId }}
                toggleVisibility={() => setIsGuestModalVisible(!isGuestModalVisible)}
            />
        </>
    )
}