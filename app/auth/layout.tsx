import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

// Assets
import background from "../../public/images/background.png";

export default async function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    const session = await unstable_getServerSession(authOptions)

    if (session) {
        redirect("/dashboard");
    }
    return (
        <div>
            {children}
            <Image src={background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
        </div>
    )
}
