'use client';

import React from "react";
import Spinner from "../Spinner";

import styles from "./styles.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string;
    isLoading?: boolean;
    additionalClasses?: string;
    textStyle?: React.CSSProperties | string;
    icon?: React.ReactElement;
    noEffects?: boolean;
    accentColor?: string;
    iconProps?: {
        position?: 'left' | 'right',
        animate?: 'size' | 'position'
    }
}

export default function Button({ label, additionalClasses, isLoading, disabled, textStyle, noEffects, icon, accentColor, iconProps, children, ...rest }: ButtonProps) {
    return <button
        className={`${styles.button} ${disabled ? styles.disabled : ""} ${noEffects ? styles.noEffects : ""} ${typeof textStyle === "string" ? textStyle : ""} ${isLoading ? styles.loading : ""} ${additionalClasses} ${iconProps?.animate === 'position' && iconProps?.position === "right" ? styles.iconRight : ""}`}
        disabled={isLoading || disabled}
        style={{ flexDirection: iconProps?.position === "right" ? "row-reverse" : "row" }}
        {...rest}
    >
        {
            isLoading ?
                <Spinner
                    color={accentColor ? accentColor : "var(--neutral)"}
                />
                :
                <>
                    {icon && icon}
                    {label && label}
                    {children}
                </>
        }
    </button>
}