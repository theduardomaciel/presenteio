// Stylesheets
import styles from './styles.module.css';

interface Props {
    title: string;
    description?: string;
}

export default function DashboardSubSectionHeader({ title, description }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <div className={styles.line} />
                <h4>{title}</h4>
            </div>
            {description && <p>{description}</p>}
        </div>
    )
}
