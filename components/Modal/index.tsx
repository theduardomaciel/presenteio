"use client";
import React from "react";
import { AnimatePresence, MotionStyle, motion } from "framer-motion";

import styles from "./modal.module.css";

// Components
import Button from "components/_ui/Button";

import Logo from "@/public/logo_gradient.svg";
import CloseIcon from "@/public/icons/close.svg";

interface ModalButton {
	text?: string;
	disabled?: boolean;
	type?: "submit" | "button";
	style?: React.CSSProperties;
	onClick?: () => void;
	icon?: React.ReactElement;
}

interface Props {
	status: boolean | "success" | "pending" | "error";
	toggleVisibility: () => void;
	children?: React.ReactNode;
	style?: MotionStyle;

	headerProps?: {
		title?: string;
		description?: React.ReactNode;
		icon?: React.ReactElement;
		insertLogo?: boolean;
		iconSize?: string;
		position?: "center" | "flex-start" | "flex-end";
		integratedTitle?: boolean;
	};

	returnButton?: {
		enabled: boolean;
		text?: string;
		icon?: React.ReactElement;
		onClick?: () => void;
	};

	buttons?: Array<ModalButton>;
}

export interface ModalProps {
	status: Props["status"];
	headerProps?: Props["headerProps"];
	buttons?: Props["buttons"];
	data?: any;
}

const getTitle = (
	status: Props["status"],
	headerProps: Props["headerProps"]
) => {
	return status === "success"
		? "Tudo certo por aqui."
		: status === "pending"
		? "Aguarde um momento..."
		: status === "error"
		? "Parece que tivemos um problema."
		: headerProps?.title;
};

export default function Modal({
	status,
	toggleVisibility,
	style,
	returnButton = { enabled: true },
	headerProps,
	buttons,
	children,
}: Props) {
	const handleClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		const target = event.nativeEvent.target as HTMLDivElement;
		if (target.id === "background") {
			if (status === "pending") return;
			toggleVisibility && toggleVisibility();
		}
	};

	const title = headerProps?.title
		? headerProps?.title
		: getTitle(status, headerProps);

	return (
		<AnimatePresence mode="wait">
			{status !== false && (
				<motion.div
					className={styles.background}
					key="modal"
					id="background"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					onClick={(event) => handleClick(event)}
				>
					<motion.div
						className={`${styles.container} scroll`}
						key="modalContent"
						style={style}
						initial={{ y: 300, x: 0, opacity: 0 }}
						animate={{ y: 0, x: 0, opacity: 1 }}
						exit={{ y: 300, x: 0, opacity: 0 }}
						transition={{ type: "spring", duration: 0.65 }}
					>
						{headerProps?.icon && (
							<div
								className={styles.headerContainer}
								style={{
									justifyContent: headerProps?.position
										? headerProps?.position
										: "center",
								}}
							>
								<div
									className={`${styles.iconHolder} ${
										headerProps?.integratedTitle
											? styles.withTitle
											: ""
									}`}
								>
									{headerProps?.icon}
								</div>
								{headerProps?.title &&
									headerProps?.integratedTitle && (
										<h2
											className={styles.title}
											style={{
												textAlign: "left",
												lineHeight: "3.55rem",
											}}
										>
											{title}
										</h2>
									)}
							</div>
						)}

						{headerProps?.insertLogo && (
							<div
								className={styles.headerContainer}
								style={{
									justifyContent: headerProps?.position
										? headerProps?.position
										: "center",
								}}
							>
								<Logo className={styles.logo} height={32} />
							</div>
						)}

						{(headerProps?.description ||
							(headerProps?.title &&
								!headerProps.integratedTitle)) && (
							<section>
								{headerProps?.title &&
									!headerProps?.integratedTitle && (
										<h2 className={styles.title}>
											{headerProps.title}
										</h2>
									)}
								{headerProps?.description &&
								typeof headerProps.description === "string" ? (
									<p className={styles.description}>
										{headerProps.description}
									</p>
								) : (
									<span className={styles.description}>
										{headerProps.description}
									</span>
								)}
							</section>
						)}

						{children}

						{buttons && buttons.length > 0 && (
							<div className={styles.buttonsHolder}>
								{buttons &&
									buttons.map((button) => {
										return (
											<Button
												key={button.text}
												onClick={button.onClick}
												isLoading={status === "pending"}
												type={
													button.type
														? button.type
														: "button"
												}
												style={{
													...button.style,
													background: button.disabled
														? "var(--light-gray)"
														: "var(--primary-01)",
													padding: `1rem 2.5rem`,
													cursor:
														button.disabled ||
														status === "pending"
															? "not-allowed"
															: "pointer",
												}}
											>
												{button.icon
													? button.icon
													: headerProps?.icon
													? headerProps.icon
													: null}
												{button.text}
											</Button>
										);
									})}
							</div>
						)}
						{returnButton.enabled && status !== "pending" ? (
							<div className={"modalFooterHolder"}>
								<div className="divisor" />
								<div
									className={"modalFooter"}
									onClick={toggleVisibility}
								>
									{returnButton.icon ? (
										returnButton.icon
									) : (
										<CloseIcon
											width={"1.6rem"}
											height={"1.6rem"}
										/>
									)}
									<p style={{ fontWeight: 700 }}>
										{" "}
										{returnButton.text
											? returnButton.text
											: "Cancelar"}{" "}
									</p>
								</div>
							</div>
						) : (
							<div className="divisor" />
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
