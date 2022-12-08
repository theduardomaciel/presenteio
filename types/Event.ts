import Guest from "./Guest";
import Account from "./Account";

interface Event {
    id: number;
    inviteCode: string;

    createdAt: Date;
    name: string;
    type: string;
    description?: string;
    color?: string;
    image_url: string;

    minPrice: number;
    maxPrice: number;

    status: string;

    acceptingGuests: boolean;
    guestsCanChangeProfileImage: boolean;

    guests: Guest[]
    host: Account;
}

export default Event;