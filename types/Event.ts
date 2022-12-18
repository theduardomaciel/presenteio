import Guest from "./Guest";
import Account from "./Account";

interface Event {
    id: number;
    inviteCode: string;

    createdAt: Date;
    name: string;
    type: "SORTEIO" | "AMIGOSECRETO";
    status: "PENDING" | "DIVULGATED";
    description?: string;
    color?: string;
    image_url?: string;
    image_deleteHash?: string;

    minPrice?: number;
    maxPrice?: number;

    allowInvite: boolean;
    allowProfileChange: boolean;

    guests: Guest[]
    host: Account;
}

export default Event;