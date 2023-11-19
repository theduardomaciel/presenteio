import Image from "next/image";

// Utils
import { getEventFromInviteCode } from "lib/getEvents";
import Overlay from "@/dashboard/components/Overlay";

interface Props {
	params?: {
		inviteCode?: string;
	};
	children: React.ReactNode;
}

export default async function InviteLayout({ params, children }: Props) {
	const event = await getEventFromInviteCode(params?.inviteCode as string);

	return (
		<div className="relative">
			{children}
			<Overlay
				style={{
					zIndex: -1,
					background:
						"radial-gradient(59.45% 59.45% at 45.17% 40.55%, var(--primary-03), rgba(255, 150, 179, 0.85), var(--primary-02))",
				}}
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
