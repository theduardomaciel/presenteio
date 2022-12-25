import dashboardStyles from '../dashboard.module.css';
import styles from './settings.module.css';

// Components
import DashboardHeader from '@dashboard/components/Header';
import CreateEventButton from '@dashboard/components/CreateEventButton';
import DashboardSectionHeader from '@dashboard/components/Section/SectionHeader';
import ThemeSelector from './components/ThemeSelector';

export default async function Dashboard() {
    return <div className={dashboardStyles.container}>
        {/* @ts-expect-error */}
        <DashboardHeader profileChildren={<CreateEventButton />} />
        <div className={`${dashboardStyles.content}`}>
            <h2 className={dashboardStyles.title}>Configurações</h2>
            <DashboardSectionHeader title='Personalização' />
            <div className={styles.option}>
                <header>
                    <h3 className={styles.optionTitle}>Tema</h3>
                    <p>Altere como o site é exibiddo para você, alternando entre um tema claro e um tema escuro ou o esquema de cores padrão de seu dispositivo.</p>
                </header>
                <ThemeSelector />
            </div>
        </div>
    </div>
}
