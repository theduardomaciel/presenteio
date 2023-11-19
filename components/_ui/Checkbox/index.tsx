"use client";

import React from "react";

// Radix
import * as PrimitiveCheckbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

import styles from "./checkbox.module.css";

interface Props extends PrimitiveCheckbox.CheckboxProps {
	label?: string;
	labelClassName?: string;
	children?: React.ReactNode;
	htmlFor?: string;
}

export default function Checkbox({
	label,
	labelClassName,
	children,
	htmlFor,
	...rest
}: Props) {
	return (
		<div className={`${styles.container} ${label ? styles.withLabel : ""}`}>
			{label && (
				<p className={`${labelClassName ?? "option"}`}>{label}</p>
			)}
			{children}
			<label htmlFor={htmlFor}>
				<PrimitiveCheckbox.Root
					className={styles.checkboxRoot}
					{...rest}
				>
					<PrimitiveCheckbox.Indicator
						className={styles.checkboxIndicator}
					>
						<CheckIcon />
					</PrimitiveCheckbox.Indicator>
				</PrimitiveCheckbox.Root>
			</label>
		</div>
	);
}
