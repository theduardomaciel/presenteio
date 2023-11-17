"use client";
import { useTheme } from "next-themes";

import styles from "../settings.module.css";

// Assets
import DefaultThemeIcon from "@/public/icons/theme/default.svg";
import LightThemeIcon from "@/public/icons/theme/light.svg";
import DarkThemeIcon from "@/public/icons/theme/dark.svg";

export default function ThemeSelector() {
	const { theme, setTheme } = useTheme();

	return (
		<div className={styles.themeButtonsHolder}>
			<div
				className={`${styles.themeItem} ${
					theme === "system" ? styles.selected : ""
				}`}
			>
				<DefaultThemeIcon onClick={() => setTheme("system")} />
				<p>Padrão do sistema</p>
			</div>
			<div
				className={`${styles.themeItem} ${
					theme === "light" ? styles.selected : ""
				}`}
			>
				<LightThemeIcon onClick={() => setTheme("light")} />
				<p>Tema claro</p>
			</div>
			<div
				className={`${styles.themeItem} ${
					theme === "dark" ? styles.selected : ""
				}`}
			>
				<DarkThemeIcon onClick={() => setTheme("dark")} />
				<p>Tema escuro</p>
			</div>
		</div>
	);
}
