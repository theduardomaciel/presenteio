"use client";

import GoogleLogo from "@/public/icons/google.svg";
import Button from "components/_ui/Button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
}

export default function GoogleButton(props: Props) {
	return (
		<Button
			type="button"
			/* 	style={{
				padding: "1.2rem",
				gap: "3rem",
				backgroundColor: "var(--neutral)",
				border: "1px solid var(--light-gray)",
				color: "var(--font-light-02)",
				fontFamily: "Arial",
				width: "100%",
				fontWeight: 700,
				fontSize: "1.4rem",
				boxShadow: "0px 4px 15px 2px rgba(0, 0, 0, 0.1)",
				borderRadius: "0.5rem",
			}} */
			className="p-3 gap-8 bg-neutral dark:bg-background-02 border border-light-gray text-font-light-02 font-bold font-sans text-[1.4rem] shadow-md rounded-[0.5rem] w-full enabled:hover:bg-slate-50 enabled:dark:hover:bg-background-01"
			suppressEffects={{
				background: true,
			}}
			accentColor={`var(--primary-01)`}
			{...props}
		>
			<GoogleLogo />
			Continuar com Google
		</Button>
	);
}
