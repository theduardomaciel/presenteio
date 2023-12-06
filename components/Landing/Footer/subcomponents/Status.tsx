import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { cn } from "utils/ui";

const STATUS = {
	OK: {
		color: "#0cc415",
		text: "Serviço em Operação",
	},
	MINOR: {
		color: "#ff8c00",
		text: "Serviço Parcialmente Degradado",
	},
	MAJOR: {
		color: "#ff8c00",
		text: "Serviço Parcialmente Degradado",
	},
	CRITICAL: {
		color: "#ff0000",
		text: "Serviço Fora do Ar",
	},
};

interface Incident {
	resolved: boolean;
	level: "MINOR" | "MAJOR" | "CRITICAL";
}

interface Project {
	name: string;
	incidents: Incident[];
}

interface StatusProps {
	className?: string;
}

export default async function Status({ className }: StatusProps) {
	const projects = await fetch(
		"https://theduardomaciel.vercel.app/api/status",
		{
			mode: "no-cors",
		}
	)
		.then((res) => res.json())
		.catch(() => null);

	if (!projects) return null;

	const presenteio = projects.find(
		(project: Project) => project.name === "presenteio"
	);

	const status =
		presenteio.incidents && presenteio.incidents.length > 0
			? STATUS[presenteio.incidents[0].level as keyof typeof STATUS]
			: STATUS.OK;

	return (
		<a
			href={
				"https://theduardomaciel.vercel.app/status?utm_source=presenteio"
			}
			target="_blank"
			className={cn(
				"flex flex-row items-center justify-center gap-x-3 px-3 py-2 transition w-full lg:w-fit outline outline-[0.75px] outline-transparent hover:bg-primary-02 rounded-md font-sans text-sm",
				className
			)}
			title="Verifique o status de nossos serviços"
		>
			<div
				className="w-2 h-2 rounded-full"
				style={{
					backgroundColor: status.color,
				}}
			/>
			<p>{status.text}</p>
			<ExternalLinkIcon width={12} height={12} color={"var(--neutral)"} />
		</a>
	);
}
