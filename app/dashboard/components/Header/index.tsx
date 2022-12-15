import Link from 'next/link';

// Components
import DashboardProfile from '../Profile';

// Stylesheets
import styles from './header.module.css';

// Icons
import Logo from '../../../../public/logo.svg';

// Auth


type Props = React.HTMLAttributes<HTMLDivElement> & {
    profileChildren?: React.ReactNode;
}

export default async function DashboardHeader({ profileChildren, children }: Props) {
    return (
        <div className={styles.container}>
            <Link href={`/dashboard`} className={styles.logo}>
                <Logo />
            </Link>
            {children}
            <DashboardProfile >
                {profileChildren}
            </DashboardProfile>
        </div>
    )
}
