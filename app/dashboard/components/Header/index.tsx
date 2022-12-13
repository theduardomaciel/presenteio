import Link from 'next/link';

// Components
import DashboardProfile from '../Profile';

// Stylesheets
import styles from './header.module.css';

// Icons
import Logo from '../../../../public/logo.svg';

// Auth
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../../../pages/api/auth/[...nextauth]';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    profileChildren?: React.ReactNode;
}

export default async function DashboardHeader({ profileChildren, children }: Props) {
    const session = await unstable_getServerSession(authOptions);

    return (
        <div className={styles.container}>
            <Link href={`/dashboard`} className={styles.logo}>
                <Logo />
            </Link>
            {children}
            <DashboardProfile account={session?.user} >
                {profileChildren}
            </DashboardProfile>
        </div>
    )
}
