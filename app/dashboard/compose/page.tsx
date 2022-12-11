// Components
import Button from '../../../components/Button';
import EventEdit from '../components/EventEdit';
import DashboardHeader from '../components/Header';
import DashboardSectionHeader from '../components/SectionHeader';
import GuestsDisplay from '../components/GuestsDisplay';

// Stylesheets
import styles from '../dashboard.module.css';

// Icons
import AddIcon from '../../../public/icons/add.svg';
import CheckboxAndLabel from '../../../components/CheckboxAndLabel';
import DashboardSubSectionHeader from '../components/SubSectionHeader';
import DashboardPricePicker from '../components/PricePicker';
import EventDisplay from '../components/EventDisplay';

export default function ComposeEvent() {
    return <div className={styles.container}>
        <DashboardHeader>
            <EventEdit />
        </DashboardHeader>
        <div className={`${styles.content} ${styles.row}`}>
            <div className={styles.column}>
                <div className={styles.section} style={{ height: "100%", gap: "1.35rem" }}>
                    <GuestsDisplay hasAddButton />
                </div>
                <div className={styles.section}>
                    <DashboardSectionHeader title="Configurações de Convite" />
                    <CheckboxAndLabel name='allowInvite' label='Permitir que outros usuários participem do evento por meio de convite' />
                    <CheckboxAndLabel name='allowChangeProfile' label='Permitir que convidados possam alterar sua foto de perfil' />
                </div>
            </div>
            <div className={styles.column}>
                <div className={styles.section}>
                    <DashboardSectionHeader title="Regras do Evento" />
                    <DashboardSubSectionHeader title='Margem de preço' description='Determine se os presentes possuirão preço mínimo e/ou máximo.' />
                    <DashboardPricePicker />
                </div>
                <div className={styles.section}>
                    <DashboardSectionHeader title="Personalização" />
                    <EventDisplay />
                </div>
                <Button label='Criar Evento' icon={< AddIcon />} style={{ width: "100%" }} />
            </div>
        </div>
    </div>
}
