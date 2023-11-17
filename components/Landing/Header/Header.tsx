"use client";
import Link from "next/link";

// Assets
import Logo from "@/public/logo_gradient.svg";

// Components
import Section from "./subcomponents/Section";

export default function LandingHeader() {
	return (
		<header className="flex flex-row justify-between items-center absolute top-0 left-0 w-full px-wrapper py-9 z-20">
			<Link href={`/`}>
				<Logo />
			</Link>
			<div className="flex flex-row items-center justify-center gap-20">
				<Section
					title="Eventos"
					href={{
						pathname: "/",
					}}
				/>
				<Section
					title="Sorteador"
					href={{
						pathname: "/shuffle",
					}}
				/>
			</div>
		</header>
	);
}
