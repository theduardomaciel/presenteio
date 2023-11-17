import Link from "next/link";

// Styling
import { cn } from "@/utils/ui";

// Icons
import Arrow_right_alt from "@/public/icons/arrow_right_alt.svg";

import TouchIcon from "@/public/icons/touch.svg";
import Dice1Icon from "@/public/icons/dice1.svg";
import HelpIcon from "@/public/icons/help.svg";

import Face1Icon from "@/public/icons/face1.svg";
import SubdirectoryIcon from "@/public/icons/subdirectory.svg";

import EnterpriseIcon from "@/public/icons/enterprise.svg";
import HouseIcon from "@/public/icons/house.svg";
import GroupsIcon from "@/public/icons/groups.svg";

import Face2Icon from "@/public/icons/face2.svg";
import CommunityIcon from "@/public/icons/community.svg";

import DnsIcon from "@/public/icons/dns.svg";
import ComputerIcon from "@/public/icons/computer.svg";
import CloudIcon from "@/public/icons/cloud.svg";
import LandingSection2_1 from "./Section2_1";

export default function LandingSection2() {
	return (
		<div className="flex flex-col items-center justify-start w-full bg-white dark:bg-background-02 gap-12 pb-20">
			<ul className="flex flex-col lg:grid grid-cols-3 lg:grid-rows-1 items-start justify-between w-full gap-6 -mt-20 px-wrapper">
				<Section2Card
					key={"1"}
					title="Eventos a poucos passos"
					description="Crie eventos sociais em poucas etapas, convide os participantes e aproveite o momento!"
					icon={
						<TouchIcon
							className="min-w-[2.4rem]"
							width={`2.4rem`}
							height={`2.4rem`}
							fill={`var(--white)`}
						/>
					}
					button={{
						text: "Criar uma conta",
						href: "/register",
						icon: (
							<Face1Icon
								className="min-w-[2.4rem]"
								width={`2.4rem`}
								height={`2.4rem`}
								fill={`var(--primary-02)`}
							/>
						),
					}}
				/>
				<Section2Card
					key={"2"}
					title="Sorteie de forma simples"
					description="Quando precisar gerar números aleatórios, utilize nosso sorteador de forma simples e rápida."
					icon={
						<Dice1Icon
							width={`2.4rem`}
							className="min-w-[2.4rem]"
							height={`2.4rem`}
							fill={`var(--white)`}
						/>
					}
					button={{
						text: "Ir para o sorteador",
						href: "/shuffle",
						icon: (
							<Arrow_right_alt
								className="min-w-[2.4rem]"
								width={`2.4rem`}
								height={`2.4rem`}
								fill={`var(--primary-02)`}
							/>
						),
					}}
				/>
				<Section2Card
					key={"3"}
					title="Precisa de ajuda?"
					description="Acesse nossa Central de Ajuda, veja as Perguntas Frequentes, ou entre em contato quando precisar!"
					icon={
						<HelpIcon
							className="min-w-[2.4rem]"
							width={`2.4rem`}
							height={`2.4rem`}
							fill={`var(--white)`}
						/>
					}
					button={{
						text: "Ver Perguntas Frequentes",
						href: "#faq",
						/* scroll: false, */
						icon: (
							<SubdirectoryIcon
								className="min-w-[2.4rem]"
								width={`2.4rem`}
								height={`2.4rem`}
								fill={`var(--primary-02)`}
							/>
						),
						iconPosition: "right",
					}}
				/>
			</ul>
			<section className="flex flex-col items-center justify-start gap-14 w-full px-wrapper">
				<Section2Title className="mt-10">
					Ferramentas simples e eficientes para você
				</Section2Title>

				<div className="flex flex-col items-center justify-start gap-6 w-full">
					<Section2Container
						title="Uma só plataforma. Infinitas possibilidades."
						description="Precisa de um sorteio para sua empresa? Um amigo secreto para o fim de ano com a família? 
Ou decidir algo simples no par ou ímpar?
O presenteio cobre todas as suas necessidades."
					>
						<ul className="flex flex-row items-center justify-center gap-4 w-full lg:w-fit lg:gap-9">
							<Section2Item1Circle>
								<EnterpriseIcon
									width={`2.4rem`}
									height={`2.4rem`}
									color={`var(--font-dark)`}
								/>
							</Section2Item1Circle>
							<Section2Item1Circle>
								<HouseIcon
									width={`2.4rem`}
									height={`2.4rem`}
									color={`var(--font-dark)`}
								/>
							</Section2Item1Circle>
							<Section2Item1Circle>
								<GroupsIcon
									width={`2.4rem`}
									height={`2.4rem`}
									color={`var(--font-dark)`}
								/>
							</Section2Item1Circle>
						</ul>
					</Section2Container>
					<Section2Container
						title="Customize seus eventos."
						description="Deixe sua criatividade tomar conta e escolha imagens, cores e formatos específicos para seus eventos."
					></Section2Container>
					<div className="flex flex-col lg:grid lg:grid-cols-2 items-center justify-between gap-6">
						<Section2Container
							title="Aproveite atualizações constantes."
							description="Enquanto tivermos apoio, trabalharemos em atualizações de conteúdo constantes, sempre em busca de qualidade excepcional."
						>
							<Face2Icon
								width={`11.8rem`}
								height={`11.8rem`}
								className="absolute -top-2 -left-1 opacity-20 -rotate-12 z-10"
								fill={`var(--primary-03)`}
							/>
							<Face2Icon
								width={`11.8rem`}
								height={`11.8rem`}
								className="absolute -top-16 right-[10%] lg:right-32 opacity-20 rotate-12 z-10"
								fill={`var(--primary-03)`}
							/>
							<Face2Icon
								width={`11.8rem`}
								height={`11.8rem`}
								className="absolute -bottom-16 left-[25%] lg:left-48 opacity-20 rotate-12 z-10"
								fill={`var(--primary-03)`}
							/>
							<Face2Icon
								width={`11.8rem`}
								height={`11.8rem`}
								className="absolute bottom-0 right-0 opacity-20 rotate-12 z-10"
								fill={`var(--primary-03)`}
							/>
						</Section2Container>
						<Section2Container
							title="Grátis. Para sempre."
							description={`Estamos comprometidos com a missão de desenvolver um serviço de qualidade. Acessível a todos.`}
							link={{
								text: "Contribua com o projeto em nosso Github!",
								href: "https://github.com/theduardomaciel/presenteio",
							}}
							flexReverse
						>
							<div className="flex flex-col items-center justify-center gap-3 py-0 px-4">
								<CommunityIcon
									width={`4.8rem`}
									height={`4.8rem`}
									fill={`var(--font-dark)`}
								/>
								<div className="flex flex-row items-center justify-center gap-3">
									<DnsIcon
										width={30}
										height={30}
										color={`var(--font-dark)`}
									/>
									<ComputerIcon
										width={30}
										height={30}
										color={`var(--font-dark)`}
									/>
									<CloudIcon
										width={30}
										height={30}
										color={`var(--font-dark)`}
									/>
								</div>
							</div>
						</Section2Container>
					</div>
					<Section2Container
						title="Convide toda a galera."
						description={`Quer chamar muitos convidados mas não quer fazer tudo na mão? Não se preocupe, com o presenteio, tudo é automatizado.`}
						flexReverse
					></Section2Container>
				</div>
			</section>
			<LandingSection2_1 />
		</div>
	);
}

export function Section2Title({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<h2
			className={cn(
				"text-primary-01 text-center font-title text-4xl max-w-[64rem] tracking-wider font-bold",
				className
			)}
		>
			{children}
		</h2>
	);
}

function Section2Item1Circle({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-center p-6 bg-primary-02 rounded-full">
			{children}
		</div>
	);
}

interface Section2ContainerProps {
	children?: React.ReactNode;
	title: string;
	description: string;
	flexReverse?: boolean;
	link?: {
		text: string;
		href: string;
	};
}

function Section2Container({
	title,
	description,
	children,
	flexReverse,
	link,
}: Section2ContainerProps) {
	return (
		<div
			className={cn(
				"flex flex-col lg:flex-row items-center w-full justify-center gap-12 p-6 h-full rounded-3xl border-2 border-primary-01 border-dashed relative overflow-hidden",
				{
					"flex-col-reverse lg:flex-row-reverse": flexReverse,
				}
			)}
		>
			<div className="flex flex-col items-center justify-start gap-2">
				<h3 className="text-font-dark text-[2.8rem] font-semibold font-title text-center">
					{title}
				</h3>
				<p className="text-font-light-02 text-lg font-serif text-center whitespace-pre-line">
					{description}
				</p>
				{link && (
					<Link
						href={link.href}
						className="text-primary-02 text-lg font-serif text-center hover:underline"
						target="_blank"
					>
						{link.text}
					</Link>
				)}
			</div>
			{children && children}
		</div>
	);
}

interface Section2CardProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	button?: {
		text: string;
		href: string;
		scroll?: boolean;
		icon?: React.ReactNode;
		iconPosition?: "left" | "right";
	};
}

function Section2Card({ title, description, icon, button }: Section2CardProps) {
	return (
		<Link href={button?.href || "/"} scroll={button?.scroll}>
			<li className="flex flex-col items-start justify-start bg-primary-02 rounded-lg p-5 gap-4">
				<div className="flex flex-col items-start justify-start gap-1">
					<div className="flex flex-row items-center justify-start gap-4">
						{icon && icon}
						<h2 className="text-xl font-title font-bold text-start leading-tight text-white">
							{title}
						</h2>
					</div>
					<p className="text-start font-serif text-lg text-white">
						{description}
					</p>
				</div>
				{button && (
					<div
						className={cn(
							"flex flex-row items-center justify-start gap-4 px-5 py-2 rounded-lg bg-white w-full text-primary-02 font-serif text-left text-lg hover:outline outline-offset-2 outline-white",
							{
								"flex-row-reverse justify-end":
									button?.iconPosition === "right",
							}
						)}
					>
						{button?.icon && button.icon}
						{button?.text}
					</div>
				)}
			</li>
		</Link>
	);
}
