import Image, { ImageLoader, ImageLoaderProps } from "next/image";

// Stylesheets
import styles from "./profile.module.css";

// Icons
import DashboardProfileMenu from "./Menu";

// Types
import { getAccount } from "@/utils/getAccount";

interface Props {
	children?: React.ReactNode;
	additionalClasses?: string;
}

export default async function DashboardProfile({
	children,
	additionalClasses,
}: Props) {
	const account = await getAccount();

	const WIDTH = 36;

	const imageProps = {
		className: styles.profileImage,
		width: WIDTH,
		height: WIDTH,
		alt: "",
	};

	const PLACEHOLDER_IMAGE_URL =
		process.env.NODE_ENV === "development"
			? `http://localhost:3000/api/images/generate/profile?name=${account?.name.replaceAll(
					" ",
					"%20"
			  )}&width=${WIDTH}`
			: `https://presenteio.vercel.app/api/images/generate/profile?name=${account?.name.replaceAll(
					" ",
					"%20"
			  )}&width=${WIDTH}`;

	return (
		<div
			className={`${styles.container} ${additionalClasses}`}
			style={children ? {} : { width: "15%" }}
		>
			{children}
			<div className={styles.profileHolder}>
				{account?.image_url ? (
					<Image src={account.image_url} {...imageProps} />
				) : (
					<img src={PLACEHOLDER_IMAGE_URL} {...imageProps} />
				)}
				<DashboardProfileMenu name={account?.name} />
			</div>
		</div>
	);
}
