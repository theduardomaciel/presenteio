'use client';
import { useState } from 'react';

import styles from '../settings.module.css'

// Assets
import DefaultThemeIcon from '@public/icons/theme/default.svg';
import LightThemeIcon from '@public/icons/theme/light.svg';
import DarkThemeIcon from '@public/icons/theme/dark.svg';
import { setTheme, getTheme } from '@utils/theme';

export default function ThemeSelector() {
    const [theme, setThemeState] = useState(getTheme())

    return (
        <div className={styles.themeButtonsHolder}>
            <div className={`${styles.themeItem} ${theme === "default" ? styles.selected : ""}`}>
                <DefaultThemeIcon onClick={() => setTheme("default", setThemeState)} />
                <p>Padrão do sistema</p>
            </div>
            <div className={`${styles.themeItem} ${theme === "light" ? styles.selected : ""}`}>
                <LightThemeIcon onClick={() => setTheme("light", setThemeState)} />
                <p>Tema claro</p>
            </div>
            <div className={`${styles.themeItem} ${theme === "dark" ? styles.selected : ""}`}>
                <DarkThemeIcon onClick={() => setTheme("dark", setThemeState)} />
                <p>Tema escuro</p>
            </div>
        </div>
    )
}