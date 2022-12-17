'use client';
import React, { useState } from 'react';

import styles from '../dashboard.module.css';

// Components
import Button from '../../../components/Button';
import DashboardSectionHeader from '@dashboard/components/Section/SectionHeader';
import CheckboxAndLabel from '../../../components/Checkbox/Label';
import DashboardSubSectionHeader from '@dashboard/components/Section/SubSectionHeader';
import DashboardPricePicker from '@dashboard/components/PricePicker';
import EventDisplay from '@dashboard/components/Event/EventDisplay';
import GuestsDisplay, { PreGuest } from '@dashboard/components/GuestsDisplay';
import Modal from 'components/Modal';

// Icons
import AddIcon from '@public/icons/add.svg';
import UploadIcon from '@public/icons/upload.svg';

// be careffull with this: https://gomakethings.com/how-to-prevent-buttons-from-causing-a-form-to-submit-with-html/ !

export default function ComposeEventForm({ children }: { children: React.ReactNode }) {
    const [confirmModalState, setConfirmModalState] = useState<false | true | { error: string } | "created">(false);
    const [isLoading, setIsLoading] = useState(false);
    const [preGuests, setPreGuests] = useState<PreGuest[]>([]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(confirmModalState)
        if (confirmModalState === true) {
            setIsLoading(true)
            const form = new FormData(event.currentTarget);

            const data = {
                name: form.get('eventName') ? form.get('eventName') : "Evento sem nome",
                allowInvite: form.get('allowInvite'),
                allowProfileChange: form.get('allowProfileChange'),
                minPrice: form.get('min'),
                maxPrice: form.get('max'),
                eventImage: form.get('eventImage'),
                guests: preGuests
            }

            console.log(data);



        }
    }

    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            {children}
            <div className={`${styles.content} ${styles.row}`}>
                <div className={styles.column}>
                    <div className={`${styles.section} ${styles.middle}`} style={{ gap: "1.35rem" }}>
                        <GuestsDisplay preGuests={preGuests} setPreGuests={setPreGuests} hasAddButton />
                    </div>
                    <div className={styles.section}>
                        <DashboardSectionHeader title="Configurações de Convite" />
                        <CheckboxAndLabel name='allowInvite' label='Permitir que outros usuários participem do evento por meio de convite' />
                        <CheckboxAndLabel name='allowProfileChange' label='Permitir que convidados possam alterar sua foto de perfil' />
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
                    <Button type="button" onClick={() => setConfirmModalState(true)} style={{ width: "100%" }}>
                        <AddIcon />
                        Criar Evento
                    </Button>
                </div>
            </div>
            <Modal
                isVisible={confirmModalState !== false}
                toggleVisibility={() => setConfirmModalState(false)}
                insertLogo
                title='Pronto para criar o evento?'
                supressReturnButton={isLoading}
                description={`Confira todas as informações antes de criá-lo para que todos os convidados tenham a experiência desejada desde o início.\n
                Não se preocupe pois nenhum convidado será notificado até que todos tenham confirmado presença.`}
            >
                <Button type='submit' isLoading={isLoading} style={{
                    width: "100%",
                    padding: "1rem 2.5rem",
                    gap: "1.5rem",
                    backgroundColor: "var(--primary-01)"
                }}>
                    Criar Evento
                    <UploadIcon />
                </Button>
            </Modal>
        </form>
    )
}