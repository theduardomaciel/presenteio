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
	suppressEffects?:
		| boolean
		| {
				background?: boolean;
				outline?: boolean;
		  };
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
	suppressEffects,
	accentColor,
	iconProps,
	children,
	...rest
}: ButtonProps) {
	return (
		<button
			className={cn(
				`${styles.button} flex flex-row justify-center items-center px-7 py-3 gap-3 text-white font-serif text-base bg-primary-02 border border-primary-03 rounded-lg transition-all duration-300 outline-1 outline-neutral`,
				`${iconProps?.animate ? styles[iconProps.animate] : ""}`,
				className,
				{
					"hover:enabled:bg-primary-01":
						typeof suppressEffects === "boolean"
							? !suppressEffects
							: !suppressEffects?.background,
					"enabled:active:outline hover:enabled:outline outline-2 outline-primary-01":
						typeof suppressEffects === "boolean"
							? !suppressEffects
							: !suppressEffects?.outline,
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
