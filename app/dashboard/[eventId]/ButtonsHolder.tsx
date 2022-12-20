'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "./styles.module.css";

import Button from "components/Button";
import Modal, { MODAL_STATE } from "components/Modal";
import DashboardSectionHeader from "@dashboard/components/Section/SectionHeader";
import { InviteOptions } from "../compose/Form";
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

export default function ButtonsHolder({ event }: { event: Omit<Event, 'createdAt'> }) {
    const [sendEmailModalState, setSendEmailModalState] = useState<MODAL_STATE>({ status: false });
    const [editEventModalState, setEditEventModalState] = useState<MODAL_STATE>({ status: false });
    const [deleteModalState, setDeleteModalState] = useState<MODAL_STATE>({ status: false });

    const [isLoading, setLoading] = useState(false);

    const BUTTON_STYLE = {
        width: "49%",
        padding: "1rem 2.5rem",
        borderRadius: "0.8rem",
        backgroundColor: event.status === "PENDING" ? "var(--primary-02)" : "var(--light-gray)",
    } as React.CSSProperties;

    async function onSubmitEdit(formEvent: React.FormEvent<HTMLFormElement>) {
        formEvent.preventDefault();
        setLoading(true)

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
                setEditEventModalState({ status: "success", value: "O evento atualizado com sucesso!" })
                router.refresh();
            } else {
                setLoading(false)
                setEditEventModalState({ status: "error", value: "Um erro interno nos impediu de atualizar o evento. Por favor, tente novamente mais tarde." })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setEditEventModalState({ status: "error", value: "Um erro interno nos impediu de atualizar o evento. Por favor, tente novamente mais tarde." })
        }
    }

    const router = useRouter();

    async function deleteEvent() {
        setLoading(true)

        try {
            const response = await axios.delete(`/api/events/${event.id}`)
            if (response) {
                router.push(`/dashboard`)
            } else {
                setDeleteModalState({ status: "error", value: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." })
            }
        } catch (error) {
            console.log(error)
            setDeleteModalState({ status: "error", value: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." })
        }
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
                isLoading={isLoading}
                headerProps={{
                    icon: <SettingsIcon width={"2.4rem"} height={"2.4rem"} />,
                    title: editEventModalState.status === "success" ? "Eba! Deu tudo certo!" : editEventModalState.status === "error" ? "Eita! Algo deu errado." : "Editar Evento",
                    description: editEventModalState.status ? editEventModalState.value : undefined,
                    integratedTitle: true
                }}
                returnButton={{
                    enabled: true,
                    text: editEventModalState.status === true ? "Cancelar" : "Voltar",
                    icon: editEventModalState.status === true ? <CloseIcon /> : <ArrowRightIcon fill="var(--primary-01)" width={18} height={18} style={{ transform: "rotate(180deg)" }} />,
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
                            <Button style={{ width: "100%", padding: "1rem", backgroundColor: "var(--primary-01)" }} onClick={() => setDeleteModalState({ status: true })}>
                                <DeleteIcon width={18} height={18} />
                                Excluir Evento
                            </Button>
                        </section>
                        <Button isLoading={isLoading} type="submit" style={{ width: "100%" }}>
                            <SaveIcon />
                            Salvar
                        </Button>
                    </form>
                }
            </Modal>
            <Modal
                isVisible={deleteModalState.status !== false}
                toggleVisibility={() => setDeleteModalState({ status: false })}
                headerProps={{
                    icon: <DeleteIcon width={"2.4rem"} height={"2.4rem"} />,
                    title: deleteModalState.status === "error" ? "Eita! Algo deu errado..." : `Você tem certeza que deseja excluir o evento?`,
                    description: deleteModalState.value ? deleteModalState.value : `Após excluir o evento, todos os dados relacionados a ele serão perdidos.`
                }}
                isLoading={isLoading}
                buttons={[
                    {
                        text: "Excluir Evento",
                        onClick: deleteEvent,
                    },
                ]}
            />
        </>
    )
}