import { cookies } from "next/headers";
import Image from "next/image";

// Assets
import Background from "../../public/images/background.png";
import DarkBackground from "../../public/images/background_dark.png";

export default async function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    const nextCookies = cookies();
    const theme = nextCookies.get('theme')?.value;

    const isDark = theme && theme === "dark";
    return (
        <>
            {children}
            <Image src={isDark ? DarkBackground : Background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
        </>
    )
}
