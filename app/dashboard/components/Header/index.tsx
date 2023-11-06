import Link from "next/link";

import styles from "./header.module.css";

// Components
import DashboardProfile from "./Profile";

// Icons
import Logo from "@/public/logo.svg";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    profileChildren?: React.ReactNode;
};

export default async function DashboardHeader({
    profileChildren,
    children,
}: Props) {
    return (
        <div className={styles.container}>
            <Link href={`/dashboard`} className={styles.logo}>
                <Logo />
            </Link>
            {children}
            {/* @ts-expect-error */}
            <DashboardProfile
                additionalClasses={children ? styles.disappear : ""}
            >
                {profileChildren}
            </DashboardProfile>
        </div>
    );
}
