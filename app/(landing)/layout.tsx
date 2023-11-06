// Stylesheets
import styles from "./landing.module.css";

// Components
import LandingHeader from "components/Landing/Header/Header";
import LandingFooter from "components/Landing/Footer/Footer";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div id="root" className={styles.container}>
			<LandingHeader />

			<main>{children}</main>

			<LandingFooter />
		</div>
	);
}

{
	/* {!hideBackground && (
				<Image
					src={
                        theme && theme === "dark" ? DarkBackground : Background
                    }
					src={Background}
					alt=""
					fill
					style={{ zIndex: -1 }}
					draggable={false}
				/>
			)} */
}
