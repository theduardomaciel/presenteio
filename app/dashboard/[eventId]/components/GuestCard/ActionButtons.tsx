'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "./styles.module.css";

import Modal, { ModalProps } from "components/Modal";
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
import DashboardToast, { ToastDynamicProps } from "components/Toast";

interface Props {
    guest: Guest
    event: Omit<Event, 'createdAt'>
}

export default function ActionButtons({ guest, event }: Props) {
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [resendEmailModalState, setResendEmailModalState] = useState<ModalProps>({ status: false });
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
    const [deleteModalState, setDeleteModalState] = useState<ModalProps>({ status: false });

    const [[isToastVisible, toastProps], setToastVisible] = useState<ToastDynamicProps>([false]);
    const router = useRouter();

    async function deleteGuest() {
        setDeleteModalState({ status: "pending" })
        try {
            const response = await axios.delete(`/api/guests/${guest.id}`)
            if (response) {
                setDeleteModalState({ status: false })
                setToastVisible([true, {
                    icon: <DeleteIcon fill="var(--primary-01)" width={36} height={36} />,
                    title: "Convidado removido!",
                    description: "O convidado foi removido do evento com sucesso!"
                }])
                router.refresh()
            } else {
                setDeleteModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." } })
            }
        } catch (error) {
            console.log(error)
            setDeleteModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." } })
        }
    }

    async function resendEmail() {
        setResendEmailModalState({ status: "pending", headerProps: { title: "Enviando e-mail...", description: "Aguarde enquanto tentamos enviar o e-mail novamente para o convidado." } })

        const resendEmailTimestampString = localStorage.getItem('resendEmailTimestamp');
        if (resendEmailTimestampString) {
            if ((new Date().getTime() - parseInt(resendEmailTimestampString)) < 86400000) {
                setResendEmailModalState({ status: "error", headerProps: { description: "Voc?? j?? reenviou um e-mail recentemente. Por favor, aguarde 24 horas para reenviar outro e-mail." } })
                return;
            }
        }

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
                setResendEmailModalState({ status: false })
                setToastVisible([true, {
                    icon: <SendEmail fill="var(--primary-01)" width={36} height={36} />,
                    title: "E-mail enviado!",
                    description: "Enviamos o e- mail com o resultado para o convidado."
                }])
                router.refresh()
            } else {
                setResendEmailModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." } })
            }
        } catch (error) {
            console.log(error)
            setResendEmailModalState({ status: "error", headerProps: { description: "Um erro interno nos impediu de excluir o evento. Por favor, tente novamente mais tarde." } })
        }
    }

    return (
        <>
            <div className={styles.actions}>
                <ShareIcon width={22} height={22} onClick={() => {
                    console.log(guest?.chosenGuest?.name)
                    setShareModalVisible(true)
                }} />
                {
                    event.status === "DIVULGATED" && guest.status === "CONFIRMED" && <>
                        <SendEmail fill="var(--neutral)" width={22} height={22} onClick={() => setResendEmailModalState({ status: true })} />
                    </>
                }
                {
                    event.status === "PENDING" &&
                    <>

                        <EditIcon fill="var(--neutral)" width={22} height={22} onClick={() => setIsGuestModalVisible(true)} />
                        <DeleteIcon fill="white" width={22} height={22} onClick={() => setDeleteModalState({ status: true })} />
                    </>
                }

            </div>
            <Modal
                status={resendEmailModalState.status}
                toggleVisibility={() => setResendEmailModalState({ status: false })}
                headerProps={{
                    icon: <SendEmail fill="var(--neutral)" width={"2.4rem"} height={"2.4rem"} />,
                    title: resendEmailModalState.headerProps?.title || "Reenviar e-mail",
                    description: resendEmailModalState.headerProps?.description || `Use essa fun????o somente caso o convidado n??o tenha recebido o e-mail ou o deletado por engano, pois o envio de novos e-mails possui um intervalo de 24 horas.\n
                    Antes de reenviar o e-mail, verifique com o convidado se o e-mail ocupa-se em outras se????es como o spam ou promo????es.`
                }}
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
                modalProps={{
                    guest: guest, postFunction: () => setToastVisible([true, {
                        icon: <EditIcon fill="var(--primary-01)" width={36} height={36} />,
                        title: "Tudo certo!",
                        description: "Os dados do convidado foram editados com sucesso."
                    }])
                }}
                toggleVisibility={() => setIsGuestModalVisible(!isGuestModalVisible)}
            />
            <ShareModal
                isVisible={isShareModalVisible}
                toggleVisibility={() => setShareModalVisible(false)}
                link={`${typeof window !== "undefined" ? window.location.origin : "https://presenteio.vercel.app"}/invite/${event.inviteCode}?guest=${guest.id}`}
                description={<p>O link abaixo ?? ??nico e <strong>exclusivo para {guest.name}</strong> e somente deve ser utilizado por esse convidado. <br />
                    Tenha cuidado, pois as informa????es pessoais do convidado podem ser visualizadas por qualquer um com acesso ao link.</p>}
            />
            <Modal
                status={deleteModalState.status}
                toggleVisibility={() => setDeleteModalState({ status: false })}
                headerProps={{
                    icon: <DeleteIcon fill="white" width={"2.4rem"} height={"2.4rem"} />,
                    title: deleteModalState.headerProps?.title || `Voc?? tem certeza que deseja remover o convidado?`,
                    description: deleteModalState.headerProps?.description || `Ap??s remover o convidado, ele n??o ser?? mais capaz de acessar o evento. Essa a????o n??o pode ser desfeita.`
                }}
                returnButton={{
                    enabled: deleteModalState.status !== "pending" ? true : false,
                }}
                buttons={[
                    {
                        text: "Remover Convidado",
                        onClick: deleteGuest,
                    },
                ]}
            />
            <DashboardToast
                isOpened={isToastVisible}
                setDynamicOpened={setToastVisible}
                toastProps={toastProps}
            />
        </>
    )
}