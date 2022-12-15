// Stylesheets
import styles from './invite.module.css'

// Assets
import ViewIcon from '../../../public/icons/view.svg';

// Sections
import Intro from './screens/Intro';

// Components
import Button from '../../../components/Button';
import GuestsView from './components/GuestsView';
import EventTitle from './components/EventTitle';

export default function Invite() {

    const STATUS = "visualized";

    const SCREENS = {
        "intro": <Intro />,
        "waiting": <div className={styles.content}>
            <EventTitle />
            <h1>Já estamos prontos.</h1>
            <p>Todos os seus dados foram atualizados. <br />
                Agora basta aguardar que todos os outros participantes entrem e o anfitrião realize o sorteio.</p>
            <Button additionalClasses={styles.button} textStyle={styles.buttonFont} label={`Os e-mails ainda não foram enviados pelo anfitrião.`} noEffects />
            <div className={"divisor"} />
        </div>,
        "visualized": <div className={styles.content}>
            <EventTitle />
            <h1>Você já visualizou seu amigo secreto.</h1>
            <p>Agora basta aguardar que todos os outros participantes entrem e visualizem seus amigos secretos.</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", maxWidth: "95%" }}>
                <Button additionalClasses={styles.button} textStyle={styles.buttonFont} label={`5/12 já visualizaram seus amigos secretos`} noEffects />
                <GuestsView />
            </div>
            <div className={'divisor'} />
            <Button icon={<ViewIcon />} additionalClasses={styles.footerButton} textStyle={styles.footerButtonFont} label={`Ver meu amigo secreto novamente`} noEffects />
        </div>,
    }

    return (
        <div className={styles.container}>
            {SCREENS[STATUS]}
        </div>
    )
}