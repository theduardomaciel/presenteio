"use client";

import inputStyles from "components/_ui/Input/styles.module.css";

import Modal from "components/Modal";

import ShareIcon from "@/public/icons/share.svg";
import { CopyIcon } from "@radix-ui/react-icons";
import ArrowRightIcon from "@/public/icons/arrow_right_alt.svg";
import { useRef } from "react";

interface Props {
	isVisible: boolean;
	toggleVisibility: () => void;
	description: React.ReactNode;
	link: string;
}

export default function ShareModal({
	isVisible,
	toggleVisibility,
	link,
	description,
}: Props) {
	const linkTextRef = useRef<HTMLParagraphElement>(null);
	function onLinkClick() {
		navigator.clipboard.writeText(link);
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
		<Modal
			status={isVisible}
			toggleVisibility={toggleVisibility}
			headerProps={{
				title: "Compartilhar evento",
				description: description,
				icon: <ShareIcon />,
				integratedTitle: true,
			}}
			returnButton={{
				enabled: true,
				text: "Voltar",
				icon: (
					<ArrowRightIcon
						width={18}
						height={18}
						fill={`var(--primary-02)`}
						style={{ transform: "rotate(180deg)" }}
					/>
				),
			}}
		>
			<div
				className={inputStyles.input}
				style={{ gap: "1rem", height: "fit-content" }}
			>
				<p
					onClick={onLinkClick}
					ref={linkTextRef}
					className="link"
					style={{ cursor: "pointer", maxWidth: "90%" }}
				>
					{link}
				</p>
				<CopyIcon width={16} height={16} />
			</div>
		</Modal>
	);
}
