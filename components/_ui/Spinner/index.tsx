import styles from './styles.module.css'

interface Props {
    color?: string;
    size?: number;
}

export default function Spinner({ color, size }: Props) {
    return <div className={`${styles.loader}`} >
        <div style={{ borderColor: `${color ? color : "var(--primary-01)"} transparent transparent transparent` }} />
        <div style={{ borderColor: `${color ? color : "var(--primary-01)"} transparent transparent transparent` }} />
    </div>
}