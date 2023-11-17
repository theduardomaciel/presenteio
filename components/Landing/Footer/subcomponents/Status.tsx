import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { cn } from "utils/ui";

interface StatusProps {
	className?: string;
}

export default function Status({ className }: StatusProps) {
	return (
		<a
			href={
				"https://theduardomaciel.vercel.app/status?utm_source=presenteio"
			}
			target="_blank"
			className={cn(
				"flex flex-row items-center justify-center gap-x-3 px-3 py-2 transition w-full lg:w-fit outline outline-[0.75px] outline-transparent hover:outline-white rounded-md font-sans text-sm",
				className
			)}
			title="Verifique o status de nossos serviços no Twitter"
		>
			{/* <div className="w-2 h-2 bg-yellow rounded-full" />
			<p>Serviço em Manutenção</p> */}
			<div className="w-2 h-2 bg-yellow-300 rounded-full" />
			<p>Serviço Parcialmente Degradado</p>
			<ExternalLinkIcon width={12} height={12} color={"var(--neutral)"} />
		</a>
	);
}
