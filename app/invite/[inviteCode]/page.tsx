import Link from 'next/link';
import { notFound } from 'next/navigation';

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

export interface InviteProps {
    params?: {
        inviteCode?: string
    },
    searchParams?: {
        guest?: string,
    }
}

export default async function Invite({ params, searchParams }: InviteProps) {
    const event = await getEventFromInviteCode(params?.inviteCode as string) as unknown as Event;
    const guest = await getGuest(searchParams?.guest as string) as unknown as Guest;

    if (!event || !guest && !event?.allowInvite) {
        notFound();
    }

    const STATUS = event?.status === "DIVULGATED" && !guest ?
        "divulgated" :
        (guest ? (guest?.status === "PENDING" ? "intro" :
            guest?.status === "CONFIRMED" ? "waiting" : "visualized") :
            "intro")

    const Title = <EventTitle type={event.type} name={event.name} />

    const SCREENS = {
        "intro": <Intro guest={guest} event={event} />,
        "divulgated": <div className={styles.content}>
            <h1>O sorteio já foi realizado.</h1>
            <p>Infelizmente, este link não está mais funcional visto que o sorteio já foi realizado entre os participantes que entraram no evento.
            </p>
            <Button additionalClasses={styles.button} noEffects >
                <p className={styles.buttonFont}>Contate o anfitrião do evento caso isso seja um erro.</p>
            </Button>
            <div className={"divisor"} />
        </div>,
        "waiting": <div className={styles.content}>
            {Title}
            <h1>Já estamos prontos.</h1>
            {
                event.status === "DIVULGATED" ?
                    <>
                        <p><strong>Verifique sua caixa de entrada!</strong> <br />
                            Os e-mails já foram enviados e estão disponíveis para visualização. Pronto para descobrir quem é seu amigo secreto?
                        </p>
                        <div className={'divisor'} />
                        <Link href={`/invite/${params?.inviteCode}/reveal?guest=${guest?.id}`} className='modalFooter'>
                            <p>                        Caso não tenha recebido o e-mail, visualize seu amigo secreto por meio do link abaixo.</p>
                            <Button
                                icon={<ViewIcon fill='var(--primary-03)' opacity={0.5} />}
                                additionalClasses={styles.footerButton}
                                noEffects
                            >
                                <p className={`${styles.footerButtonFont}`}>Ver meu amigo secreto</p>
                            </Button>
                        </Link>
                    </>
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
            {Title}
            <h1>Você já visualizou seu amigo secreto.</h1>
            <p>Agora basta aguardar que todos os outros participantes entrem e visualizem seus amigos secretos.</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", maxWidth: "95%" }}>
                <Button additionalClasses={styles.button} noEffects >
                    <p className={styles.buttonFont}>{event?.guests.filter(guest => guest.status === "VISUALIZED").length}/{event?.guests.length} já visualizaram seus amigos secretos</p>
                </Button>
                <GuestsView guests={event.guests} />
            </div>
            <div className={'divisor'} />
            <Link href={`/invite/${params?.inviteCode}/reveal?guest=${guest?.id}`} className='modalFooter'>
                <Button
                    icon={<ViewIcon fill='var(--primary-03)' opacity={0.5} />}
                    additionalClasses={styles.footerButton}
                    noEffects
                >
                    <p className={`${styles.footerButtonFont}`}>Ver meu amigo secreto novamente</p>
                </Button>
            </Link>
        </div>,
    }

    return (
        <div className={styles.container}>
            {SCREENS[STATUS]}
        </div>
    )
}