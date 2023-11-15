"use client";

import {
	CSSProperties,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./menu.module.css";

// Assets
import DownArrow from "@/public/icons/down_arrow.svg";
import ConfigIcon from "@/public/icons/settings_menu.svg";
import LogoutIcon from "@/public/icons/logout.svg";

// Components
import Button from "components/_ui/Button";

// Utils
import { logoutAction } from "./logout";

export default function DashboardProfileMenu({ name }: { name?: string }) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggingOff, startTransition] = useTransition();

	function toggleOpen() {
		setIsOpen(!isOpen);
	}

	const onClick = (event: any) => {
		if (popout.current) {
			if (
				isOpen === true &&
				popout.current.contains(event.target) === false
			) {
				toggleOpen();
				window.removeEventListener("click", onClick);
			}
		}
	};

	const popout = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			window.addEventListener("click", onClick);
			return () => window.removeEventListener("click", onClick);
		}, 500);
	}, [isOpen]);

	useLayoutEffect(() => {
		// GAMBIARRA
		if (!name) {
			startTransition(logoutAction);
			setTimeout(() => {
				router.push("/");
			}, 10);
		}
	}, []);

	return (
		<AnimatePresence key={"headerProfileMenu"}>
			<DownArrow onClick={toggleOpen} />
			{isOpen && (
				<motion.div
					className={styles.container}
					initial={"closed"}
					animate={"open"}
					exit={"closed"}
					key={"reports"}
					ref={popout}
					variants={{
						open: {
							opacity: 1,
							y: -25,
							transition: { ease: "backOut", duration: 0.45 },
						},
						closed: {
							y: -35,
							opacity: 0,
						},
						exit: {
							y: -35,
							opacity: 0,
						},
					}}
				>
					<header>
						<h3>{`${name ? name : ""}`}</h3>
					</header>
					<div
						style={{ backgroundColor: "var(--primary-03)" }}
						className={styles.line}
					></div>
					<ul className={styles.buttons}>
						<Link href={`/dashboard/settings`}>
							<Button
								label="Configurações"
								style={buttonStyle}
								icon={<ConfigIcon width={28} height={28} />}
								onClick={() => setIsOpen(false)}
							/>
						</Link>
						<Button
							label="Log-out"
							type="submit"
							onClick={() => {
								startTransition(logoutAction);
								setTimeout(() => {
									router.push("/");
								}, 10);
							}}
							style={buttonStyle}
							icon={<LogoutIcon width={28} height={28} />}
						/>
					</ul>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const buttonStyle = {
	width: "100%",
	background: "none",
	border: "none",
	justifyContent: "flex-start",
	gap: "1.5rem",
	paddingInline: "1.5rem",
	color: "var(--primary-02)",
} as CSSProperties;
