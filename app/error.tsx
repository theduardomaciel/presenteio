'use client';
import { useEffect } from 'react';

import Link from 'next/link';

// Stylesheets
import styles from './landing.module.css';

// Components
import Button from 'components/Button';

export default function Error({ error, reset, }: { error: Error; reset: () => void }) {

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className={styles.container}>
            <h1>{`Eita! Parece que algo deu errado :(`}</h1>
            <p><strong>{error.name}</strong></p>
            <p>{error.message}</p>
            <Link href={`/`}>
                <Button onClick={() => reset()}>
                    Voltar para o início
                </Button>
            </Link>
        </div>
    )
}
