"use client";
import React, { useState } from "react";

import styles from "../dashboard.module.css";

// Components
import Button from "../../../components/Button";
import DashboardSectionHeader from "@dashboard/components/Section/SectionHeader";
import CheckboxAndLabel from "../../../components/Checkbox/Label";
import DashboardSubSectionHeader from "@dashboard/components/Section/SubSectionHeader";
import DashboardPricePicker from "@dashboard/components/Event/PricePicker";
import EventDisplay from "@dashboard/components/Event/EventDisplay";
import GuestsDisplay, {
    PreGuest,
} from "app/dashboard/compose/PreGuestsDisplay";
import Modal, { ModalProps } from "components/Modal";

// Icons
import AddIcon from "@/public/icons/add.svg";
import UploadIcon from "@/public/icons/upload.svg";

// Utils
import axios from "axios";
import { getCookie } from "@utils/cookies";
import { useRouter } from "next/navigation";
import { extractBase64, toBase64 } from "@utils/base64";

// be carefull with this: https://gomakethings.com/how-to-prevent-buttons-from-causing-a-form-to-submit-with-html/ !

export const InviteOptions = ({
    defaultValues,
}: {
    defaultValues?: { allowInvite?: boolean; allowProfileChange?: boolean };
}) => {
    return (
        <>
            <CheckboxAndLabel
                defaultChecked={defaultValues?.allowInvite}
                name="allowInvite"
                label="Permitir que outros usuários participem do evento por meio de convite"
            />
            <CheckboxAndLabel
                defaultChecked={defaultValues?.allowProfileChange}
                name="allowProfileChange"
                label="Permitir que convidados possam alterar sua foto de perfil"
            />
        </>
    );
};

export default function ComposeEventForm({
    children,
}: {
    children: React.ReactNode;
}) {
    const [confirmModalState, setConfirmModalState] = useState<ModalProps>({
        status: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [preGuests, setPreGuests] = useState<PreGuest[]>([]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(confirmModalState);
        if (confirmModalState.status === true) {
            setIsLoading(true);
            setConfirmModalState({
                status: "pending",
                headerProps: {
                    title: "Aguarde um momento...",
                    description:
                        "Estamos criando seu evento, isso pode demorar um pouco.",
                },
            });
            const form = new FormData(event.currentTarget);

            const eventImage = form.get("eventImageUpload") as File;
            const image_base64 = eventImage
                ? ((await toBase64(eventImage)) as string)
                : undefined;
            const correctedImage =
                image_base64 && image_base64.length > 30
                    ? extractBase64(image_base64)
                    : undefined;

            const guestsWithImage = await Promise.all(
                Array.from(preGuests).map(async (guest) => {
                    if (guest.image) {
                        const guestImage_base64 = (await toBase64(
                            guest.image
                        )) as string;
                        guest.imagePreview = extractBase64(guestImage_base64);
                    }
                    return guest;
                })
            );

            const data = {
                name: form.get("eventName")
                    ? form.get("eventName")
                    : "Evento sem nome",
                allowInvite: form.get("allowInvite"),
                allowProfileChange: form.get("allowProfileChange"),
                minPrice: form.get("min"),
                maxPrice: form.get("max"),
                image_base64: correctedImage,
                guests: guestsWithImage,
            };
            console.log(data);

            const config = {
                headers: {
                    Authorization: `Bearer ${getCookie("presenteio.token")}`,
                },
            };

            try {
                const response = await axios.post(
                    `/api/events/compose`,
                    data,
                    config
                );
                if (response) {
                    console.log(response.data);
                    setConfirmModalState({
                        status: "success",
                        data: response.data.id,
                        headerProps: {
                            description: `Eba! Seu evento foi criado com sucesso!\n 
                    Agora é só enviar o convite geral ou os convites personalizados para os convidados e aproveitar o momento!`,
                        },
                    });
                } else {
                    setConfirmModalState({
                        status: "error",
                        headerProps: {
                            description: `Não foi possível obter uma resposta de nossos servidores acerca de seu evento. Por favor, tente novamente.`,
                        },
                    });
                }
                setIsLoading(false);
            } catch (error: any) {
                console.log(error);
                setConfirmModalState({
                    status: "error",
                    headerProps: {
                        description: `Não foi possível criar seu evento. Por favor, tente novamente.`,
                    },
                });
                setIsLoading(false);
            }
        }
    }

    const router = useRouter();
    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            {children}
            <div className={`${styles.content} ${styles.row}`}>
                <div className={styles.column}>
                    <div
                        className={`${styles.section} ${styles.middle}`}
                        style={{ gap: "1.35rem" }}
                    >
                        <GuestsDisplay
                            preGuests={preGuests}
                            setPreGuests={setPreGuests}
                            hasAddButton
                        />
                    </div>
                    <div className={styles.section}>
                        <DashboardSectionHeader title="Configurações de Convite" />
                        <InviteOptions />
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.section}>
                        <DashboardSectionHeader title="Regras do Evento" />
                        <DashboardSubSectionHeader
                            title="Margem de preço"
                            description="Determine se os presentes possuirão preço mínimo e/ou máximo."
                        />
                        <DashboardPricePicker fixedWidth />
                    </div>
                    <div className={styles.section}>
                        <DashboardSectionHeader title="Personalização" />
                        <EventDisplay />
                    </div>
                    <Button
                        type="button"
                        onClick={() => setConfirmModalState({ status: true })}
                        style={{ width: "100%" }}
                    >
                        <AddIcon />
                        Criar Evento
                    </Button>
                </div>
            </div>
            <Modal
                status={confirmModalState.status}
                toggleVisibility={() => setConfirmModalState({ status: false })}
                headerProps={{
                    insertLogo: true,
                    title:
                        confirmModalState.headerProps?.title ||
                        "Pronto para criar o evento?",
                    description:
                        confirmModalState.headerProps?.description ||
                        `Confira todas as informações antes de criá-lo para que todos os convidados tenham a experiência desejada desde o início.\n
                Não se preocupe pois nenhum convidado será notificado até que todos tenham confirmado presença.`,
                }}
                returnButton={{
                    enabled:
                        confirmModalState.status !== "success" &&
                        confirmModalState.status !== "pending"
                            ? true
                            : false,
                }}
                buttons={[
                    {
                        text: "Ir para o Evento",
                        onClick:
                            confirmModalState.status === "success"
                                ? () =>
                                      router.replace(
                                          `/dashboard/${confirmModalState.data}`
                                      )
                                : undefined,
                    },
                ]}
            >
                {confirmModalState.status === true && (
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        style={{
                            width: "100%",
                            padding: "1rem 2.5rem",
                            gap: "1.5rem",
                            backgroundColor: "var(--primary-01)",
                        }}
                    >
                        Criar Evento
                        <UploadIcon />
                    </Button>
                )}
            </Modal>
        </form>
    );
}
