import Image from "next/image";
import { cookies } from "next/headers";

// Assets
import Background from "@/public/images/background.png";
import DarkBackground from "@/public/images/background_dark.png";

import { getEventFromInviteCode } from "lib/getEvents";
import type { Event } from "@prisma/client";

interface Props {
	params?: {
		inviteCode?: string;
	};
	children: React.ReactNode;
}

export default async function InviteLayout({ params, children }: Props) {
	const event = (await getEventFromInviteCode(
		params?.inviteCode as string
	)) as unknown as Event;

	const nextCookies = cookies();
	const theme = nextCookies.get("theme")?.value;

	const isDark = theme && theme === "dark";
	return (
		<div className="relative">
			{children}
			<Image
				src={isDark ? DarkBackground : Background}
				alt=""
				fill
				style={{ zIndex: -1 }}
				draggable={false}
			/>
			{event && event.image_url && (
				<Image
					src={event.image_url}
					alt=""
					fill
					style={{ zIndex: -2, opacity: 0.2 }}
					className="imageContain"
					draggable={false}
				/>
			)}
		</div>
	);
}
