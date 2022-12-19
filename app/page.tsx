import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Landing from "./landing";

export default function LandingIndex() {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');

    if (token) {
        redirect(`/dashboard`)
    }

    return (
        <Landing />
    )
}