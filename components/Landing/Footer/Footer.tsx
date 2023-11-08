import { cookies } from "next/headers";

import Logo from "@/public/logo.svg";

// Components
import ThemePicker from "./subcomponents/ThemePicker";
import LanguagePicker from "./subcomponents/LanguagePicker";
import Status from "./subcomponents/Status";

// Utils

export default function LandingFooter() {
	const theme = cookies().get("theme");

	return (
		<footer className="w-full flex flex-col items-center justify-center gap-y-10 gap-x-12 px-wrapper bg-primary-01 py-12">
			<div className="flex flex-col items-start justify-start w-full gap-12">
				<div className="flex flex-col md:flex-row flex-wrap gap-y-12 items-start justify-between gap-x-4 w-full relative">
					{/* Column1 - title and PC buttons holder */}
					<div className="flex flex-1 flex-col w-full md:w-fit lg:relative lg:top-0 lg:left-0 lg:self-stretch justify-between min-w-[25%] gap-y-4">
						{/* title */}
						<div className="flex flex-1 flex-col items-center md:items-start justify-start gap-y-4">
							<div className="flex flex-row items-center justify-start gap-x-5">
								<a
									href="/"
									className="font-title text-2xl text-text-100"
								>
									<Logo />
								</a>
							</div>
						</div>
						{/* PC buttons holder */}
						<div className="flex-row items-center justify-start gap-x-6 hidden lg:flex">
							<ThemePicker initialTheme={theme?.value as any} />
							<LanguagePicker />
						</div>
					</div>
					{/* Sections */}
					<div className="flex flex-col md:flex-row items-start justify-end gap-12">
						<Section
							title="Ajuda"
							links={[
								{
									title: "Central de Ajuda",
									href: "/help",
								},
								{
									title: "Fale Conosco",
									href: "/contact",
								},
							]}
						/>
						<Section
							title="Legal"
							links={[
								{
									title: "Política de Privacidade",
									href: "/privacy",
								},
								{
									title: "Termos de Uso",
									href: "/terms",
								},
							]}
						/>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center w-full gap-y-6 lg:hidden">
					<div className="flex flex-row items-center justify-between w-full">
						<ThemePicker />
						<LanguagePicker />
					</div>
				</div>
				<div className="w-full flex flex-wrap gap-8 items-center justify-center lg:justify-between">
					<p className="flex-1 text-sm text-text-100 text-center md:text-left whitespace-normal break-words font-sans">
						Copyright @ 2023 | feito com ❤️ por @theduardomaciel
					</p>
					<Status />
				</div>
			</div>
		</footer>
	);
}

interface SectionProps {
	title: string;
	links?: {
		title: string;
		href: string;
	}[];
	children?: React.ReactNode;
}

const Section = ({ title, links, children }: SectionProps) => {
	return (
		<ul className="flex flex-col items-start justify-start gap-y-5">
			<li
				key={"sectionTitle"}
				className="font-title text-base mb-1 text-neutral font-bold"
			>
				{title}
			</li>
			{links &&
				links.map((link, index) => (
					<a href={link.href} key={index.toString()}>
						<li className="mr-12 font-regular text-sm cursor-pointer text-text-100 hover:text-text-200 transition-colors font-serif hover:underline">
							{link.title}
						</li>
					</a>
				))}
			{children}
		</ul>
	);
};
