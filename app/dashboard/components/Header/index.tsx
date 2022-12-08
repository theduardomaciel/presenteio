'use client';

import Link from 'next/link';

// Components
import DashboardProfile from '../Profile';

// Stylesheets
import styles from './header.module.css';

// Icons
import Logo from '../../../../public/logo.svg';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    profileChildren?: React.ReactNode;
}

export default function DashboardHeader({ profileChildren, children }: Props) {
    return (
        <div className={styles.container}>
            <Link href={`/dashboard`} style={{ width: "10%" }}>
                <Logo />
            </Link>
            {children}
            <DashboardProfile>
                {profileChildren}
            </DashboardProfile>
        </div>
    )
}
