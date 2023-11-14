"use client";
import { useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectGroup,
	SelectScrollUp,
	SelectScrollDown,
	SelectTrigger,
	SelectValue,
} from "components/_ui/Select";

type Theme = "system" | "dark" | "light";

import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ICONS = {
	system: <DesktopIcon width={14} className="min-w-[14px]" height={14} />,
	light: (
		<SunIcon
			width={14}
			className="min-w-[14px]"
			height={14}
			color="var(--primary-02)"
		/>
	),
	dark: (
		<MoonIcon
			width={14}
			className="min-w-[14px]"
			height={14}
			color="var(--primary-02)"
		/>
	),
};

interface Props {
	initialTheme?: Theme;
}

// No futuro, quando houver dicionários de tradução, utilizar o método de SelectValue comentado

export default function ThemePicker({ initialTheme = "system" }: Props) {
	const [theme, setThemeState] = useState<Theme>("system");

	return (
		<Select
			defaultValue={theme}
			value={theme}
			onValueChange={(value) => console.log(value)}
		>
			<SelectTrigger className="shadow-sm" icon={ICONS[theme as Theme]}>
				<SelectValue placeholder={initialTheme} />
			</SelectTrigger>
			<SelectContent>
				<SelectScrollUp />
				<SelectGroup>
					<SelectLabel>Tema</SelectLabel>
					<SelectItem value="system" icon={ICONS.system}>
						Auto
					</SelectItem>
					<SelectItem value="light" icon={ICONS.light}>
						Claro
					</SelectItem>
					<SelectItem value="dark" icon={ICONS.dark}>
						Escuro
					</SelectItem>
				</SelectGroup>
				<SelectScrollDown />
			</SelectContent>
		</Select>
	);
}
