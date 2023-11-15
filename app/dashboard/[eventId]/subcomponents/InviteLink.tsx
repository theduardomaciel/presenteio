"use client";
import { useRef, useState } from "react";

import DashboardToast from "components/_ui/Toast";

import { CopyIcon } from "@radix-ui/react-icons";

export default function InviteLink({ inviteCode }: { inviteCode: string }) {
	const link = `https://presenteio.vercel.app/invite/${inviteCode}`;
	const linkTextRef = useRef<HTMLParagraphElement>(null);

	const [isToastVisible, setToastVisible] = useState(false);

	function onLinkClick() {
		navigator.clipboard.writeText(link);
		setToastVisible(true);
		if (linkTextRef.current) {
			linkTextRef.current.textContent =
				"Copiado para a área de transferência!";
			setTimeout(() => {
				if (linkTextRef.current) {
					linkTextRef.current.textContent = link;
				}
			}, 1000);
		}
	}

	return (
		<>
			<p
				ref={linkTextRef}
				onClick={onLinkClick}
				className="link cursor-pointer"
			>
				{link}
			</p>
			<DashboardToast
				isOpened={isToastVisible}
				setOpened={setToastVisible}
				toastProps={{
					icon: (
						<CopyIcon
							color="var(--primary-01)"
							width={24}
							height={24}
						/>
					),
					title: "Link copiado!",
					description:
						"O link de convite geral agora está em sua área de transferência.",
				}}
			/>
		</>
	);
}
