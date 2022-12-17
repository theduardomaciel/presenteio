import Link from 'next/link';

// Stylesheets
import styles from './landing.module.css';

// Components
import Button from 'components/Button';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <h1>404</h1>
            <p>{`Eita! Parece que essa página não existe!`}</p>
            <Link href={`/`}>
                <Button>
                    Voltar para o início
                </Button>
            </Link>
        </div>
    )
}
