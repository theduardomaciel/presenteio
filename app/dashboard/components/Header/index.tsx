import Link from 'next/link';

import styles from './header.module.css';

// Components
import DashboardProfile from './Profile';

// Icons
import Logo from '@public/logo.svg';


type Props = React.HTMLAttributes<HTMLDivElement> & {
    profileChildren?: React.ReactNode;
}

export default function DashboardHeader({ profileChildren, children }: Props) {
    return (
        <div className={styles.container}>
            <Link href={`/dashboard`} className={styles.logo}>
                <Logo />
            </Link>
            {children}
            <DashboardProfile additionalClasses={children ? styles.disappear : ""}>
                {profileChildren}
            </DashboardProfile>
        </div>
    )
}
