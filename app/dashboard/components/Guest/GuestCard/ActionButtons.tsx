'use client';
import { useState } from "react";

import styles from "./styles.module.css";

import Modal, { MODAL_STATE } from "components/Modal";
import ShareModal from "@dashboard/components/Event/ShareModal";
import GuestModal from "../GuestModal";

// Icons
import ShareIcon from "@public/icons/share.svg";
import SendEmail from "@public/icons/send_email.svg";
import EditIcon from "@public/icons/edit.svg";

// Types
import { EventStatus } from "types/Event";
import { GuestStatus } from "types/Guest";

export default function ActionButtons({ guestLink, eventStatus, guestStatus }: { guestLink: string, eventStatus: EventStatus, guestStatus: GuestStatus }) {
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [resendEmailModalState, setResendEmailModalState] = useState<MODAL_STATE>({ status: false });
    const [guestModalProps, setGuestModalProps] = useState<{ status: boolean, guestId?: string }>({ status: false, guestId: undefined });

    return (
        <>
            <div className={styles.actions}>
                {
                    eventStatus === "DIVULGATED" && guestStatus === "CONFIRMED" && <SendEmail width={22} height={22} onClick={() => setResendEmailModalState({ status: true })} />
                }
                {
                    eventStatus === "PENDING" && <ShareIcon width={22} height={22} onClick={() => setShareModalVisible(true)} />
                }
                {
                    eventStatus === "PENDING" &&
                    <EditIcon width={22} height={22} />
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
            {/* <GuestModal
            
            /> */}
            <ShareModal
                isVisible={isShareModalVisible}
                toggleVisibility={() => setShareModalVisible(false)}
                link={guestLink}
                description={<p>O link abaixo é único e exclusivo para <strong>Fulano da Silva</strong> e <strong>somente deve ser utilizado por esse convidado.</strong> <br />
                    Cuidado! Pois as informações do convidado podem ser visualizadas por qualquer um com acesso ao link.</p>}
            />
        </>
    )
}