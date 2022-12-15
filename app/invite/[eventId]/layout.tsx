import Image from "next/image";

// Assets
import background from "../../../public/images/background.png";
import placeholder from "../../../public/images/placeholder.webp";

export default async function InviteLayout({ params, children }: {
    params: any,
    children: React.ReactNode
}) {
    console.log(params)
    return (
        <div style={{ overflow: "hidden" }}>
            {children}
            <Image src={background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
            <Image src={placeholder} alt="" fill style={{ zIndex: -2, opacity: 0.2 }} className="imageContain" draggable={false} />
        </div>
    )
}
