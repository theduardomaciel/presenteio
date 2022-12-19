// Stylesheets
import styles from './invite.module.css'

// Assets
import ViewIcon from '@public/icons/view.svg';

// Sections
import Intro from './Intro';

// Components
import Button from 'components/Button';
import GuestsView from './components/GuestsView';
import EventTitle from './components/EventTitle';

// Utils
import { getEventFromInviteCode } from '@utils/getEvents';
import { getGuest } from '@utils/getGuest';

import Event from 'types/Event';
import Guest from 'types/Guest';

interface Props {
    params?: {
        inviteCode?: string
    },
    searchParams?: {
        guest?: string,
    }
}

export default function Invite({ params, searchParams }: Props) {
    const event = getEventFromInviteCode(params?.inviteCode as string) as unknown as Event;
    const guest = getGuest(searchParams?.guest as string) as unknown as Guest;

    const STATUS = event.status === "DIVULGATED" ?
        "divulgated" :
        (guest ? (guest.status === "PENDING" ? "intro" :
            guest.status === "CONFIRMED" ? "waiting" : "visualized") :
            "intro")

    const SCREENS = {
        "intro": <Intro guest={guest} event={event} />,
        "divulgated": <div className={styles.content}>
            <EventTitle />
            <h1>O sorteio já foi realizado.</h1>
            <p>Infelizmente, este link não está mais funcional visto que o sorteio já foi realizado entre os participantes que entraram no evento.
            </p>
            <Button additionalClasses={styles.button} noEffects >
                <p className={styles.buttonFont}>Contate o anfitrião do evento caso isso seja um erro.</p>
            </Button>
            <div className={"divisor"} />
        </div>,
        "waiting": <div className={styles.content}>
            <EventTitle />
            <h1>Já estamos prontos.</h1>
            {
                event.status === "DIVULGATED" ?
                    <p>Verifique sua caixa de entrada! <br />
                        Os e-mails já foram enviados e estão disponíveis para visualização. Pronto para descobrir quem é seu amigo secreto? <br />
                        Caso não tenha recebido o e-mail, verifique sua caixa de spam ou entre em contato com o anfitrião do evento.
                    </p>
                    :
                    <p>Todos os seus dados foram atualizados. <br />
                        Agora basta aguardar que todos os outros participantes entrem e o anfitrião realize o sorteio.</p>
            }
            <Button additionalClasses={styles.button} noEffects >
                <p className={styles.buttonFont}>{event.status === "DIVULGATED" ? "Os e-mails já foram enviados pelo anfitrião!" : "Os e-mails ainda não foram enviados pelo anfitrião."}</p>
            </Button>
            <div className={"divisor"} />
        </div>,
        "visualized": <div className={styles.content}>
            <EventTitle />
            <h1>Você já visualizou seu amigo secreto.</h1>
            <p>Agora basta aguardar que todos os outros participantes entrem e visualizem seus amigos secretos.</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", maxWidth: "95%" }}>
                <Button additionalClasses={styles.button} noEffects >
                    <p className={styles.buttonFont}>5/12 já visualizaram seus amigos secretos</p>
                </Button>
                <GuestsView />
            </div>
            <div className={'divisor'} />
            <Button
                icon={<ViewIcon />}
                additionalClasses={styles.footerButton}
                label={`Ver meu amigo secreto novamente`}
                noEffects
            >
                <p className={`${styles.footerButtonFont} modalFooter`}>`Ver meu amigo secreto novamente</p>
            </Button>
        </div>,
    }

    return (
        <div className={styles.container}>
            {SCREENS[STATUS]}
        </div>
    )
}