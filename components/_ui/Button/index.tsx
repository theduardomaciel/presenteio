"use client";

import React from "react";
import Spinner from "../Spinner";

import styles from "./styles.module.css";
import { cn } from "@/utils/ui";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	icon?: React.ReactNode;
	isLoading?: boolean;
	className?: string;
	noEffects?: boolean;
	accentColor?: string;
	iconProps?: {
		animate?:
			| "position-toRight"
			| "position-toLeft"
			| "scale-increase"
			| "scale-decrease";
	};
}

export default function Button({
	label,
	icon,
	className,
	isLoading,
	disabled,
	noEffects,
	accentColor,
	iconProps,
	children,
	...rest
}: ButtonProps) {
	return (
		<button
			className={cn(
				`${styles.button} flex flex-row justify-center items-center px-7 py-3 gap-3 text-white font-serif text-base bg-primary-02 border border-primary-03 rounded-lg transition-all duration-300 enabled:active:outline outline-1 outline-neutral`,
				className,
				{
					"hover:enabled:bg-primary-01 hover:enabled:outline outline-2 outline-primary-01":
						!noEffects,
					"bg-primary-03 border-none cursor-not-allowed":
						disabled || isLoading,
				}
			)}
			disabled={isLoading || disabled}
			{...rest}
		>
			{isLoading ? (
				<Spinner color={accentColor ? accentColor : "var(--neutral)"} />
			) : (
				<>
					{icon && icon}
					{label && label}
					{children}
				</>
			)}
		</button>
	);
}
