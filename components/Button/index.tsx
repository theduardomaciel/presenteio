'use client';

import React from "react";
import Spinner from "../Spinner";

import styles from "./styles.module.css"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    additionalClasses?: string;
    icon?: React.ReactElement;
    accentColor?: string;
    iconProps?: {
        position?: 'left' | 'right',
        animate?: 'size' | 'position'
    }
}

export default function Button({ label, additionalClasses, isLoading, isDisabled, icon, accentColor, iconProps, children, ...rest }: ButtonProps) {
    return <button
        className={`${styles.button} ${isDisabled ? styles.disabled : ""} ${isLoading ? styles.loading : ""} ${additionalClasses} ${iconProps?.animate === 'position' && iconProps?.position === "right" ? styles.iconRight : ""}`}
        disabled={isLoading || isDisabled}
        style={{ flexDirection: iconProps?.position === "right" ? "row-reverse" : "row" }}
        {...rest}
    >
        {
            isLoading ?
                <Spinner
                    color={accentColor ? accentColor : undefined}
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