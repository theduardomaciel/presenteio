import Link from 'next/link';

// Stylesheets
import styles from '../landing.module.css';
import Landing from '../page';

// Components
import Button from '../../components/Button';
import Input from '../../components/Input';
import { GoogleButton } from '../auth/register/page';

export default function Error() {
    return (
        <div className={styles.container}>
            <h1>Página de erro por enquanto :)</h1>
        </div>
    )
}
