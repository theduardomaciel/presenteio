"use client";
import { useTheme } from "next-themes";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectGroup,
	SelectTrigger,
	SelectValue,
} from "components/_ui/Select";

// Assets
import SystemIcon from "@/public/icons/computer.svg";
import DarkIcon from "@/public/icons/theme/dark2.svg";
import LightIcon from "@/public/icons/theme/light2.svg";
import { useEffect, useState } from "react";

type Theme = "system" | "dark" | "light";

const ICONS = {
	system: <SystemIcon width={14} height={14} />,
	light: <LightIcon width={14} height={14} />,
	dark: <DarkIcon width={14} height={14} />,
};

export default function ThemePicker() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, theme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Select defaultValue={theme} value={theme} onValueChange={setTheme}>
			<SelectTrigger
				className="shadow-sm text-neutral"
				icon={ICONS[theme as Theme]}
			>
				<SelectValue placeholder={theme} />
			</SelectTrigger>
			<SelectContent>
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
			</SelectContent>
		</Select>
	);
}
