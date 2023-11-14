import { cn } from "@/utils/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SectionProps {
	title: string;
	href: {
		pathname: string;
		query?: {
			[key: string]: any;
		};
	};
}

export default function Section({ title, href }: SectionProps) {
	const pathname = usePathname();
	const isActive = pathname === href.pathname;

	return (
		<Link
			href={href}
			className={cn(
				"font-serif font-bold text-primary-03 text-base relative after:flex after:rounded-full after:w-3/4 after:bg-primary-01 after:h-[1.5px] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:scale-x-0 after:transition transition duration-300 after:duration-300 leading-none",
				{
					"text-primary-01 after:scale-x-100 max-md:hidden": isActive,
				}
			)}
		>
			{title}
		</Link>
	);
}
