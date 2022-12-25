import React from "react";
import { getCookie, setCookie } from "./cookies";

export type Theme = 'dark' | 'light' | 'default';

export function getTheme() {
    /* const [theme, setTheme] = React.useState<Theme>('default');

    React.useEffect(() => {
        const cookieTheme = getCookie('theme');
        if (cookieTheme) {
            setTheme(cookieTheme as Theme);
        }
    }); */
    const theme = (getCookie('theme') || window.matchMedia("(prefers-color-scheme: dark)").matches) as Theme;

    return theme;
}

export function setTheme(theme: Theme, setThemeState: React.Dispatch<React.SetStateAction<Theme>>) {
    // Alterando dados
    document.body.setAttribute('data-theme', theme);
    setCookie('theme', theme);
    setThemeState(theme);

    // Alterando visual
    if (theme === "dark" || theme === "default" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    console.log('Tema alterado para: ' + theme);
}
