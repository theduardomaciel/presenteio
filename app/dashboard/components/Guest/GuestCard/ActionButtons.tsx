'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import styles from "./styles.module.css";

import Modal, { MODAL_STATE } from "components/Modal";
import ShareModal from "@dashboard/components/Event/ShareModal";
import GuestModal from "../GuestModal";

// Icons
import ShareIcon from "@public/icons/share.svg";
import SendEmail from "@public/icons/send_email.svg";
import EditIcon from "@public/icons/edit.svg";
import DeleteIcon from "@public/icons/delete.svg";

// Types
import { EventStatus } from "types/Event";
import Guest from "types/Guest";
import DashboardToast from "components/Toast";

interface Props {
    guest: Guest
    inviteLink: string;
    eventStatus: EventStatus;
}

export default function ActionButtons({ guest, eventStatus, inviteLink }: Props) {
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [resendEmailModalState, setResendEmailModalState] = useState<MODAL_STATE>({ status: false });
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
    const [deleteModalState, setDeleteModalState] = useState<MODAL_STATE>({ status: false });

    const [isDeleteToastVisible, setDeleteToastVisible] = useState(false);
    const [isEditToastVisible, setEditToastVisible] = useState(false);

    const [isLoading, setLoading] = useState(false)
    const router = useRouter();

    async function deleteGuest() {
        setLoading(true)

        try {
            const response = await axios.delete(`/api/guests/${guest.id}`)
            if (response) {
                setLoading(false)
                setDeleteModalState({ status: false })
                setDeleteToastVisible(true)
                router.refresh()
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
            <div className={styles.actions}>
                {
                    eventStatus === "DIVULGATED" && guest.status === "CONFIRMED" && <SendEmail width={22} height={22} onClick={() => setResendEmailModalState({ status: true })} />
                }
                {
                    eventStatus === "PENDING" &&
                    <>
                        <ShareIcon width={22} height={22} onClick={() => setShareModalVisible(true)} />
                        <EditIcon width={22} height={22} onClick={() => setIsGuestModalVisible(true)} />
                        <DeleteIcon fill="white" width={22} height={22} onClick={() => setDeleteModalState({ status: true })} />
                    </>
                }

            </div>
            <Modal
                isVisible={resendEmailModalState.status !== false}
                toggleVisibility={() => setResendEmailModalState({ status: false })}
                headerProps={{
                    icon: <SendEmail width={"2.4rem"} height={"2.4rem"} />,
                    title: `Você deseja enviar o e-mail novamente a este convidado?`,
                    description: `Somente faça isso caso o convidado tenha deletado o e-mail por engano.`
                }}
                buttons={[
                    {
                        text: "Reenviar e-mail",
                        onClick: () => { },
                    },
                ]}
            />
            <GuestModal
                isVisible={isGuestModalVisible}
                modalProps={{ guest: guest, postFunction: () => setEditToastVisible(true) }}
                toggleVisibility={() => setIsGuestModalVisible(!isGuestModalVisible)}
            />
            <ShareModal
                isVisible={isShareModalVisible}
                toggleVisibility={() => setShareModalVisible(false)}
                link={inviteLink}
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
                isLoading={isLoading}
                buttons={[
                    {
                        text: "Remover Convidado",
                        onClick: deleteGuest,
                    },
                ]}
            />
            <DashboardToast
                isOpened={isDeleteToastVisible}
                setOpened={setDeleteToastVisible}
                title="Eba! Deu tudo certo!"
                icon={<DeleteIcon fill="var(--primary-01)" width={36} height={36} />} description="O convidado foi removido do evento com sucesso."
            />
            <DashboardToast
                isOpened={isEditToastVisible}
                setOpened={setEditToastVisible}
                title="Eba! Deu tudo certo!"
                icon={<EditIcon fill="var(--primary-01)" width={36} height={36} />} description="Os dados do convidado foram editados com sucesso."
            />
        </>
    )
}