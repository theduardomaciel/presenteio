import { cookies } from "next/headers";
import Landing from "./landing";

export default function LandingIndex() {
    const nextCookies = cookies();
    const theme = nextCookies.get('theme')?.value;

    return (
        <Landing theme={theme} />
    )
}