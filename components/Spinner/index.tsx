import styles from './styles.module.css'

interface Props {
    color?: string;
    size?: number;
}

export default function Spinner({ color, size }: Props) {
    return <div className={`${styles.loader}`} style={{ borderColor: color ? color : "var(--primary-02)" }}>
        <div />
        <div />
    </div>
}