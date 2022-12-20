import Event from "./Event";

export type GuestStatus = "PENDING" | "CONFIRMED" | "VISUALIZED";

interface Guest {
    id: string;
    name: string;
    email: string;
    image_url: string;
    image_deleteHash?: string;

    chosenGuest?: Guest;
    status: GuestStatus;

    event?: Event;
    accountId: number;
}

export default Guest;