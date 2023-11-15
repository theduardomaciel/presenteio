import React, { useEffect } from "react";

import {
	SelectItem,
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectLabel,
	SelectGroup,
} from "components/_ui/Select";
import { SelectArrow } from "@radix-ui/react-select";

const COLORS = {
	RED: {
		primary: "#D50000",
		secondary: "#C51162",
		tertiary: "#FF8A80",
	}, // vermelho
	PURPLE: {
		primary: "#6200EE",
		secondary: "#3700B3",
		tertiary: "#BB86FC",
	}, // roxo
	BLUE: {
		primary: "#2962FF",
		secondary: "#1744FF",
		tertiary: "#8C9EFF",
	}, // azul
	GREEN: {
		primary: "#00C853",
		secondary: "#00B248",
		tertiary: "#69F0AE",
	}, // verde
	YELLOW: {
		primary: "#FFD600",
		secondary: "#FFC400",
		tertiary: "#FFFF8D",
	}, // amarelo
	PINK: {
		primary: "#D500F9",
		secondary: "#AA00FF",
		tertiary: "#FF80AB",
	}, // rosa
	ORANGE: {
		primary: "#FF6D00",
		secondary: "#FF9100",
		tertiary: "#FFD180",
	}, // laranja
	BROWN: {
		primary: "#795548",
		secondary: "#5D4037",
		tertiary: "#BCAAA4",
	}, // marrom
	GREY: {
		primary: "#616161",
		secondary: "#424242",
		tertiary: "#BDBDBD",
	}, // cinza
};

export default function EventThemePicker({
	defaultColor,
}: {
	defaultColor?: keyof typeof COLORS;
}) {
	const [value, setValue] = React.useState<keyof typeof COLORS>(
		defaultColor || "RED"
	);

	function onSelect(color: keyof typeof COLORS) {
		/* document.documentElement.style.setProperty(
			"--primary-01",
			COLORS[color].primary
		);
		document.documentElement.style.setProperty(
			"--primary-02",
			COLORS[color].secondary
		);
		document.documentElement.style.setProperty(
			"--primary-03",
			COLORS[color].tertiary
		); */
	}

	/* useEffect(() => {
		onSelect(defaultColor || "RED");
	}, [defaultColor]); */

	return (
		<Select
			name="accentColor"
			defaultValue={defaultColor || "RED"}
			onValueChange={(value: keyof typeof COLORS) => setValue(value)}
		>
			<SelectTrigger
				className="cursor-pointer bg-transparent border-none enabled:hover:bg-transparent focus:bg-transparent focus:select-none focus:ring-transparent focus:outline-none placeholder:text-white focus-within:shadow-none"
				hideChevron
			>
				<div
					className="w-[2.5rem] h-[2.5rem] rounded-full"
					style={{
						backgroundColor: COLORS[value].primary,
					}}
				/>
				<SelectValue placeholder="Cor de destaque" />
			</SelectTrigger>
			<SelectContent
				position="popper"
				side="top"
				className="h-64 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative"
				style={{
					minWidth: "fit-content",
					width: "var(--radix-select-trigger-width)",
				}}
			>
				<SelectGroup>
					<SelectLabel>Selecione uma cor principal</SelectLabel>
					{Object.entries(COLORS).map(([name, color]) => (
						<ColorItem
							key={name}
							color={color.primary as keyof typeof COLORS}
							name={name}
						/>
					))}
				</SelectGroup>
				<SelectArrow className="fill-blue-900 text-blue-900" />
			</SelectContent>
		</Select>
	);
}

interface ColorItemProps {
	color: keyof typeof COLORS;
	name: string;
}

function ColorItem({ color, name }: ColorItemProps) {
	return (
		<SelectItem
			value={name}
			suppressCheckIcon
			style={{
				color: color,
			}}
			icon={
				<div
					className="w-[2.5rem] h-[2.5rem] rounded-full"
					style={{
						backgroundColor: color,
					}}
				/>
			}
		>
			{COLORS_PT[name as keyof typeof COLORS_PT]}
		</SelectItem>
	);
}

const COLORS_PT = {
	PURPLE: "Roxo",
	BLUE: "Azul",
	GREEN: "Verde",
	YELLOW: "Amarelo",
	RED: "Vermelho",
	PINK: "Rosa",
	ORANGE: "Laranja",
	BROWN: "Marrom",
	GREY: "Cinza",
};
