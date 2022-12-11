interface Guest {
    id: string;
    name: string;
    email: string;
    image_url: string;

    status: "PENDING" | "CONFIRMED" | "VISUALIZED";

    accountId: number;
}

export default Guest;