'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "./styles.module.css";

import Modal, { MODAL_STATE } from "components/Modal";
import ShareModal from "@dashboard/components/Event/ShareModal";
import GuestModal from "../../../components/Guest/GuestModal";

// Icons
import ShareIcon from "@public/icons/share.svg";
import SendEmail from "@public/icons/send_email.svg";
import EditIcon from "@public/icons/edit.svg";
import DeleteIcon from "@public/icons/delete.svg";

// Types
import Event, { EventStatus } from "types/Event";
import Guest from "types/Guest";
import DashboardToast from "components/Toast";

interface Props {
    guest: Guest
    event: Omit<Event, 'createdAt'>
}

export default function ActionButtons({ guest, event }: Props) {
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [resendEmailModalState, setResendEmailModalState] = useState<MODAL_STATE>({ status: false });
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
    const [deleteModalState, setDeleteModalState] = useState<MODAL_STATE>({ status: false });

    const [[isToastVisible, toastMessage, toastIcon], setToastVisible] = useState<[boolean, string, React.ReactElement | null]>([false, "", null]);
    const [isLoading, setLoading] = useState(false)
    const router = useRouter();

    async function deleteGuest() {
        setLoading(true)
        setDeleteModalState({ status: "pending" })

        try {
            const response = await axios.delete(`/api/guests/${guest.id}`)
            if (response) {
                setLoading(false)
                setDeleteModalState({ status: false })
                setToastVisible([true, "O convidado foi removido do evento com sucesso!", <DeleteIcon fill="var(--primary-01)" width={36} height={36} />])
                router.refresh()
            } else {
                setDeleteModalState({ status: "error", value: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." })
            }
        } catch (error) {
            console.log(error)
            setDeleteModalState({ status: "error", value: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." })
        }
    }

    async function resendEmail() {
        setLoading(true)
        setResendEmailModalState({ status: "pending", value: "Aguarde enquanto tentamos enviar o e-mail novamente para o convidado." })

        /* const resendEmailTimestampString = localStorage.getItem('resendEmailTimestamp');
        if (resendEmailTimestampString) {
            if ((new Date().getTime() - parseInt(resendEmailTimestampString)) < 86400000) {
                setResendEmailModalState({ status: "error", value: "Você já reenviou um e-mail recentemente. Por favor, aguarde 24 horas para reenviar outro e-mail." })
                setLoading(false)
                return;
            }
        } */

        try {
            const response = await axios.post(`/api/emails/sendEmail`, {
                resendRevealEmail: true,
                sendTo: guest.email,
                emailProps: {
                    guestName: guest.name,
                    guestId: guest.id,
                    eventName: event.name,
                    eventType: event.type,
                    eventInviteCode: event.inviteCode,
                }
            })
            console.log(response)
            if (response) {
                localStorage.setItem('resendEmailTimestamp', new Date().getTime().toString())
                setLoading(false)
                setResendEmailModalState({ status: false })
                setToastVisible([true, "Enviamos o e-mail com o resultado para o convidado.", <SendEmail fill="var(--primary-01)" width={36} height={36} />])
                router.refresh()
            } else {
                setResendEmailModalState({ status: "error", value: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." })
            }
        } catch (error) {
            console.log(error)
            setResendEmailModalState({ status: "error", value: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." })
        }
    }

    return (
        <>
            <div className={styles.actions}>
                {
                    event.status === "DIVULGATED" && guest.status === "CONFIRMED" && <SendEmail fill="var(--neutral)" width={22} height={22} onClick={() => setResendEmailModalState({ status: true })} />
                }
                {
                    event.status === "PENDING" &&
                    <>
                        <ShareIcon width={22} height={22} onClick={() => setShareModalVisible(true)} />
                        <EditIcon fill="var(--neutral)" width={22} height={22} onClick={() => setIsGuestModalVisible(true)} />
                        <DeleteIcon fill="white" width={22} height={22} onClick={() => setDeleteModalState({ status: true })} />
                    </>
                }

            </div>
            <Modal
                isVisible={resendEmailModalState.status !== false}
                toggleVisibility={() => setResendEmailModalState({ status: false })}
                headerProps={{
                    icon: <SendEmail fill="var(--neutral)" width={"2.4rem"} height={"2.4rem"} />,
                    title: resendEmailModalState.status === "pending" ? "Enviando e-mail..." : resendEmailModalState.status === "error" ? "Eita! Não conseguimos!" : `Você deseja enviar o e-mail novamente a este convidado?`,
                    description: resendEmailModalState.value ? resendEmailModalState.value : `Use essa função somente caso o convidado não tenha recebido o e-mail ou o deletado por engano, pois o envio de novos e-mails possui um intervalo de 24 horas.\n
                    Antes de reenviar o e-mail, verifique com o convidado se o e-mail ocupa-se em outras seções como o spam ou promoções.`
                }}
                isLoading={isLoading}
                returnButton={{
                    enabled: resendEmailModalState.status !== "pending" ? true : false,
                }}
                buttons={resendEmailModalState.status === true ? [
                    {
                        text: "Reenviar e-mail",
                        onClick: resendEmail,
                    },
                ] : undefined}
            />
            <GuestModal
                isVisible={isGuestModalVisible}
                modalProps={{ guest: guest, postFunction: () => setToastVisible([true, "Os dados do convidado foram editados com sucesso.", <EditIcon fill="var(--primary-01)" width={36} height={36} />]) }}
                toggleVisibility={() => setIsGuestModalVisible(!isGuestModalVisible)}
            />
            <ShareModal
                isVisible={isShareModalVisible}
                toggleVisibility={() => setShareModalVisible(false)}
                link={`${typeof window !== "undefined" ? window.location.origin : "https://presenteio.vercel.app"}/invite/${event.inviteCode}?guest=${guest.id}`}
                description={<p>O link abaixo é único e exclusivo para <strong>Fulano da Silva</strong> e <strong>somente deve ser utilizado por esse convidado.</strong> <br />
                    Cuidado! Pois as informações do convidado podem ser visualizadas por qualquer um com acesso ao link.</p>}
            />
            <Modal
                isVisible={deleteModalState.status !== false}
                toggleVisibility={() => setDeleteModalState({ status: false })}
                headerProps={{
                    icon: <DeleteIcon fill="white" width={"2.4rem"} height={"2.4rem"} />,
                    title: deleteModalState.status === "error" ? "Eita! Algo deu errado..." : `Você tem certeza que deseja remover o convidado?`,
                    description: deleteModalState.value ? deleteModalState.value : `Após remover o convidado, ele não será mais capaz de acessar o evento.`
                }}
                returnButton={{
                    enabled: deleteModalState.status !== "pending" ? true : false,
                }}
                isLoading={isLoading}
                buttons={[
                    {
                        text: "Remover Convidado",
                        onClick: deleteGuest,
                    },
                ]}
            />
            <DashboardToast
                isOpened={isToastVisible}
                setOpened={setToastVisible}
                title="Eba! Deu tudo certo!"
                icon={toastIcon}
                description={toastMessage}
            />
        </>
    )
}