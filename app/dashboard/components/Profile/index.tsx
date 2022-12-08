import Image from 'next/image';
import Link from 'next/link';

// Stylesheets
import styles from './profile.module.css';

// Icons
import DownArrow from '../../../../public/icons/down_arrow.svg';

export default function DashboardProfile({ children }: { children?: React.ReactNode }) {
    return (
        <div className={styles.container} style={children ? {} : { width: "10%" }}>
            {children}
            <div className={styles.profileHolder}>
                <Image className={styles.profileImage} src={`https://github.com/theduardomaciel.png`} width={36} height={36} alt='' />
                <DownArrow />
            </div>
        </div>
    )
}
