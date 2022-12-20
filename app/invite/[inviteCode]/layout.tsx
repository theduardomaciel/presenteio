import Image from "next/image";

// Assets
import background from "@public/images/background.png";
import placeholder from "@public/images/placeholder.webp";

import { getEventFromInviteCode } from "@utils/getEvents";
import Event from "types/Event";

interface Props {
    params?: {
        inviteCode?: string
    },
    children: React.ReactNode
}

export default async function InviteLayout({ params, children }: Props) {
    const event = await getEventFromInviteCode(params?.inviteCode as string) as unknown as Event;
    return (
        <div style={{ position: "relative" }}>
            {children}
            <Image src={background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
            {
                event.image_url && <Image src={event.image_url} alt="" fill style={{ zIndex: -2, opacity: 0.2 }} className="imageContain" draggable={false} />
            }
        </div>
    )
}
