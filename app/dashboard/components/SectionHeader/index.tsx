// Stylesheets
import styles from './styles.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    removeLine?: boolean;
}

export default function DashboardSectionHeader({ title, removeLine, children }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h3>{title}</h3>
                {children}
            </div>
            <div className={styles.line} />
        </div>
    )
}
