'use client';
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "../styles.module.css";

import Button from "components/Button";
import Modal, { ModalProps } from "components/Modal";
import DashboardSectionHeader from "@dashboard/components/Section/SectionHeader";
import { InviteOptions } from "../../compose/Form";
import DashboardSubSectionHeader from "@dashboard/components/Section/SubSectionHeader";
import DashboardPricePicker from "@dashboard/components/Event/PricePicker";

// Assets
import SendEmail from "@public/icons/send_email.svg";
import SettingsIcon from "@public/icons/settings.svg";
import SaveIcon from "@public/icons/save.svg";
import CloseIcon from "@public/icons/close.svg";
import ArrowRightIcon from "@public/icons/arrow_right_alt.svg";
import DeleteIcon from "@public/icons/delete.svg";

import Event from "types/Event";
import DashboardToast, { ToastDynamicProps } from "components/Toast";

const ENABLED_BUTTON = {
    padding: "1rem 2.5rem",
    borderRadius: "0.8rem",
    backgroundColor: "var(--primary-02)",
} as React.CSSProperties;

const DISABLED_BUTTON = {
    padding: "1rem 2.5rem",
    borderRadius: "0.8rem",
    border: "none",
    outline: "none",
    backgroundColor: "var(--light-gray)",
} as React.CSSProperties;

export default function ButtonsHolder({ event }: { event: Omit<Event, 'createdAt'> }) {
    const [sendEmailModalState, setSendEmailModalState] = useState<ModalProps>({ status: false });
    const [editEventModalState, setEditEventModalState] = useState<ModalProps>({ status: false });
    const [deleteModalState, setDeleteModalState] = useState<ModalProps>({ status: false });

    const [[isToastVisible, toastProps], setToastVisible] = useState<ToastDynamicProps>([false]);

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmitEdit(formEvent: React.FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        setEditEventModalState((previousState => ({ ...previousState, status: "pending" })));

        const form = new FormData(formEvent.currentTarget);

        const data = {
            allowInvite: form.get('allowInvite') as string,
            allowProfileChange: form.get('allowProfileChange') as string,
            minPrice: form.get('min') as string,
            maxPrice: form.get('max') as string,
        }

        try {
            const response = await axios.patch(`/api/events/${event.id}`, data)
            if (response) {
                setLoading(false)
                setEditEventModalState({ status: "success", headerProps: { description: "O evento atualizado com sucesso!" } })
                router.refresh();
            } else {
                setLoading(false)
                setEditEventModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de atualizar o evento. Por favor, tente novamente mais tarde." } })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setEditEventModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de atualizar o evento. Por favor, tente novamente mais tarde." } })
        }
    }

    async function deleteEvent() {
        setLoading(true)
        setDeleteModalState({ status: "pending", headerProps: { description: "Estamos excluindo o evento e todos os seus dados." } })

        try {
            const response = await axios.delete(`/api/events/${event.id}`)
            if (response) {
                router.refresh()
                router.push(`/dashboard`)
            } else {
                setDeleteModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." } })
            }
        } catch (error) {
            console.log(error)
            setDeleteModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." } })
        }
    }

    async function raffleGuests() {
        setLoading(true)
        setSendEmailModalState({ status: "pending", headerProps: { title: "Aguarde um momento...", description: "Estamos sorteando os convidados e enviando os e-mails com os resultados pessoais a todos." } })

        try {
            const response = await axios.post(`/api/events/raffle`, { id: event.id })
            if (response) {
                setLoading(false)
                setSendEmailModalState({
                    status: "success",
                    headerProps: {
                        title: "Os e-mails foram enviados com sucesso!",
                        description: `Todos os participantes já foram sorteados, agora, basta que cada um acesse seu e-mail para descobrir quem foi seu sorteado!\n\nA partir de agora, nenhum outro participante pode entrar no evento.`
                    }
                })
                router.refresh();
            } else {
                setLoading(false)
                setSendEmailModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de sortear os convidados. Por favor, tente novamente mais tarde." } })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setSendEmailModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de sortear os convidados. Por favor, tente novamente mais tarde." } })
        }
    }

    const MIN_GUESTS = 3;
    const DISABLED = useMemo(() => event.status === "DIVULGATED" || event.guests.length < MIN_GUESTS, [event])
    const hasGuestsWithoutEmail = event.guests.filter(guest => !guest.email).length > 0

    return (
        <>
            <div className={styles.buttonsHolder}>
                <Button
                    style={DISABLED ? DISABLED_BUTTON : ENABLED_BUTTON}
                    onClick={() => {
                        if (DISABLED) {
                            if (event.status === "DIVULGATED") {
                                setToastVisible([true, {
                                    status: "info",
                                    title: "Infelizmente, não é possível realizar esta ação.",
                                    description: `O sorteio já foi realizado e os e-mails já foram enviados.`,
                                }])

                            } else {
                                setToastVisible([true, {
                                    status: "info",
                                    title: "Infelizmente, não é possível realizar esta ação.",
                                    description: `Para realizar o sorteio, o evento deve ter pelo menos ${MIN_GUESTS} convidados.`,
                                }])
                            }
                        } else {
                            setSendEmailModalState({ status: true })
                        }
                    }}
                >
                    <SendEmail fill="var(--neutral)" height={24} width={24} />
                    Sortear e enviar e-mails
                </Button>
                <Button style={ENABLED_BUTTON} onClick={() => setEditEventModalState({ status: true })}>
                    <SettingsIcon height={24} width={24} />
                    Configurações do Evento
                </Button>
            </div>
            <Modal
                status={editEventModalState.status}
                toggleVisibility={() => setEditEventModalState({ status: false })}
                headerProps={{
                    icon: <SettingsIcon width={"2.4rem"} height={"2.4rem"} />,
                    title: editEventModalState.headerProps?.title || "Editar Evento",
                    description: editEventModalState.headerProps?.description,
                    integratedTitle: true
                }}
                returnButton={{
                    enabled: true,
                    text: editEventModalState.status === true ? "Cancelar" : "Fechar",
                    //icon: editEventModalState.status === true ? <CloseIcon /> : <ArrowRightIcon fill="var(--primary-01)" width={18} height={18} style={{ transform: "rotate(180deg)" }} />,
                    onClick: () => setEditEventModalState({ status: false }),
                }}
            >
                {
                    editEventModalState.status === true && <form onSubmit={onSubmitEdit} className={styles.form}>
                        <section>
                            <DashboardSectionHeader title="Configurações de convite" />
                            <InviteOptions defaultValues={{ allowInvite: event.allowInvite, allowProfileChange: event.allowProfileChange }} />
                        </section>
                        <section>
                            <DashboardSectionHeader title="Regras do Evento" />
                            <DashboardSubSectionHeader title='Margem de preço' description='Altere os valores de preço mínimo e/ou máximo dos presentes do evento.' />
                            <DashboardPricePicker defaultValues={{ min: event.minPrice, max: event.maxPrice }} />
                        </section>
                        <section>
                            <DashboardSubSectionHeader title='Zona de Perigo' description='As ações tomadas nessa seção sao permanentes e irreversíveis.' />
                            <Button
                                type="button"
                                style={{ width: "100%", padding: "1rem", backgroundColor: "var(--primary-01)" }}
                                onClick={() => {
                                    setEditEventModalState({ status: false })
                                    setDeleteModalState({ status: true })
                                }}
                            >
                                <DeleteIcon fill="var(--neutral)" width={18} height={18} />
                                Excluir Evento
                            </Button>
                        </section>
                        <Button isLoading={isLoading} type="submit" style={{ width: "100%" }}>
                            <SaveIcon fill="var(--neutral)" />
                            Salvar
                        </Button>
                    </form>
                }
            </Modal>
            <Modal
                status={sendEmailModalState.status}
                toggleVisibility={() => setDeleteModalState({ status: false })}
                headerProps={{
                    icon: <DeleteIcon fill="var(--neutral)" width={"2.4rem"} height={"2.4rem"} />,
                    title: deleteModalState.headerProps?.title || `Você tem certeza que deseja excluir o evento?`,
                    description: deleteModalState.headerProps?.description
                }}
                buttons={[
                    {
                        text: "Excluir Evento",
                        type: "button",
                        onClick: deleteEvent,
                    },
                ]}
            />
            <Modal
                status={sendEmailModalState.status}
                toggleVisibility={() => setSendEmailModalState({ status: false })}
                style={{ gap: "3.5rem" }}
                headerProps={{
                    icon: sendEmailModalState.status === true ? <SendEmail fill="var(--neutral)" width={"2.4rem"} height={"2.4rem"} /> : undefined,
                    insertLogo: sendEmailModalState.status !== true,
                    title: sendEmailModalState.headerProps?.title || `Você tem certeza que deseja enviar os e-mails?`,
                    description: sendEmailModalState.headerProps?.description ||
                        `${hasGuestsWithoutEmail ? "Alguns convidados ainda não inseriram seus e-mails, portanto nem todos receberão o link em sua caixa de entrada!\n\n" : ""}Após enviar os e-mails, novos usuários não poderão participar do evento e a edição das informações dos convidados será bloqueada.`
                }}
                returnButton={{
                    enabled: sendEmailModalState.status !== "pending" ? true : false,
                    text: sendEmailModalState.status === true ? "Cancelar" : "Voltar",
                    icon: sendEmailModalState.status === true ? <CloseIcon /> : <ArrowRightIcon fill="var(--primary-01)" width={18} height={18} style={{ transform: "rotate(180deg)" }} />,
                    onClick: () => setSendEmailModalState({ status: false }),
                }}
                buttons={sendEmailModalState.status === (true || "pending") ? [
                    {
                        text: "Enviar e-mails",
                        onClick: raffleGuests,
                    },
                ] : undefined}
            />
            <DashboardToast
                toastProps={toastProps}
                isOpened={isToastVisible}
                setDynamicOpened={setToastVisible}
            />
        </>
    )
}