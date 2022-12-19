'use client';
import { useState } from "react";

import styles from "./styles.module.css";

import Button from "components/Button";
import Modal, { MODAL_STATE } from "components/Modal";

// Assets
import SendEmail from "@public/icons/send_email.svg";
import SettingsIcon from "@public/icons/settings.svg";
import SaveIcon from "@public/icons/save.svg";

import Event from "types/Event";
import DashboardSectionHeader from "@dashboard/components/Section/SectionHeader";
import { InviteOptions } from "../compose/Form";
import DashboardSubSectionHeader from "@dashboard/components/Section/SubSectionHeader";
import DashboardPricePicker from "@dashboard/components/Event/PricePicker";

export default function ButtonsHolder({ event }: { event: Omit<Event, 'createdAt'> }) {
    const [sendEmailModalState, setSendEmailModalState] = useState<MODAL_STATE>({ status: false });
    const [editEventModalState, setEditEventModalState] = useState<MODAL_STATE>({ status: false });

    const BUTTON_STYLE = {
        width: "49%",
        padding: "1rem 2.5rem",
        borderRadius: "0.8rem",
        backgroundColor: event.status === "PENDING" ? "var(--primary-02)" : "var(--light-gray)",
    } as React.CSSProperties;

    async function onSubmitEdit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const allowInvite = form.get('allowInvite') as string;
        const allowProfileChange = form.get('allowProfileChange') as string;
    }

    return (
        <>
            <div className={styles.buttonsHolder}>
                <Button style={BUTTON_STYLE} onClick={() => setSendEmailModalState({ status: true })}>
                    <SendEmail height={24} width={24} />
                    Enviar e-mails
                </Button>
                <Button style={BUTTON_STYLE} onClick={() => setEditEventModalState({ status: true })}>
                    <SettingsIcon height={24} width={24} />
                    Configurações do Evento
                </Button>
            </div>
            <Modal
                isVisible={sendEmailModalState.status !== false}
                toggleVisibility={() => setSendEmailModalState({ status: false })}
                headerProps={{
                    icon: <SendEmail width={"2.4rem"} height={"2.4rem"} />,
                    title: `Você tem certeza que deseja enviar os e-mails?`,
                    description: `Após enviar os e-mails, novos usuários não poderão participar do evento e a edição das informações dos convidados será bloqueada.`
                }}
                buttons={[
                    {
                        text: "Enviar e-mails",
                        onClick: () => { },
                    },
                ]}
            />
            <Modal
                isVisible={editEventModalState.status !== false}
                toggleVisibility={() => setEditEventModalState({ status: false })}
                headerProps={{
                    icon: <SettingsIcon width={"2.4rem"} height={"2.4rem"} />,
                    title: "Editar Evento",
                    integratedTitle: true
                }}
                buttons={[
                    {
                        text: "Salvar",
                        icon: <SaveIcon />,
                        style: { width: "100%" },
                        onClick: () => { },
                    },
                ]}
            >
                <form onSubmit={onSubmitEdit} className={styles.form}>
                    <section>
                        <DashboardSectionHeader title="Configurações de convite" />
                        <InviteOptions />
                    </section>
                    <section>
                        <DashboardSectionHeader title="Regras do Evento" />
                        <DashboardSubSectionHeader title='Margem de preço' description='Altere os valores de preço mínimo e/ou máximo dos presentes do evento.' />
                        <DashboardPricePicker />
                    </section>
                </form>
            </Modal>
        </>
    )
}