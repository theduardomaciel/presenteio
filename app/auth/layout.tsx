import Image from "next/image";

// Assets
import background from "../../public/images/background.png";

export default function AuthLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
            <Image src={background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
        </div>
    )
}
