import styles from "./overlay.module.css";

export default function Overlay({ style }: { style?: React.CSSProperties }) {
	return (
		<div
			className={styles.overlay}
			style={{
				background:
					"radial-gradient(59.45% 59.45% at 45.17% 40.55%, var(--primary-03), var(--primary-02)",
				...style,
			}}
		/>
	);
}
