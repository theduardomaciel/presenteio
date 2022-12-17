'use client';

import React from "react";
import Spinner from "../Spinner";

import styles from "./styles.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
    additionalClasses?: string;
    noEffects?: boolean;
    accentColor?: string;
    iconProps?: {
        animate?: 'position-toRight' | 'position-toLeft' | 'scale-increase' | 'scale-decrease';
    }
}

export default function Button({ label, icon, additionalClasses, isLoading, disabled, noEffects, accentColor, iconProps, children, ...rest }: ButtonProps) {
    return <button
        className={`${styles.button} ${disabled ? styles.disabled : ""} ${noEffects ? styles.noEffects : ""}  ${isLoading ? styles.loading : ""} ${additionalClasses} ${iconProps?.animate ? styles[iconProps.animate] : ""}`}
        disabled={isLoading || disabled}
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