import Image from "next/image";

// Stylesheets
import styles from "./profile.module.css";

// Icons
import DashboardProfileMenu from "./Menu";

// Types
import { getAccount } from "lib/getAccount";

interface Props {
	children?: React.ReactNode;
	additionalClasses?: string;
}

export default async function DashboardProfile({
	children,
	additionalClasses,
}: Props) {
	const account = await getAccount();

	return (
		<div
			className={`${styles.container} ${additionalClasses}`}
			style={children ? {} : { width: "15%" }}
		>
			{children}
			<div className={styles.profileHolder}>
				{account?.image_url ? (
					<Image
						src={account.image_url}
						className={styles.profileImage}
						width={36}
						height={36}
						alt="Profile Image"
					/>
				) : (
					<div className={styles.profileImage}>
						<span>
							{account?.name
								.split(" ")
								.map((name) => name[0])
								.join("")}
						</span>
					</div>
				)}
				<DashboardProfileMenu name={account?.name} />
			</div>
		</div>
	);
}
