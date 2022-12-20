'use client';

import { useRef, useState } from "react";
import Image from "next/image";

import styles from "./intro.module.css";

import { GUEST_IMAGE_PLACEHOLDER } from "@dashboard/components/Guest/GuestModal";

import CloseIcon from "@public/icons/close.svg";
import AddPhotoIcon from '@public/icons/add_photo.svg';

import Button from "components/Button";
import AuthModal, { Section } from "components/AuthModal";
import Input from "components/Input";

// Hooks
import useImagePreview from "hooks/useImagePreview";
import Guest from "types/Guest";

interface Props {
    guest?: Guest;
}

export default function ParticipateButton({ guest }: Props) {
    const [[actualSection, direction], setActualSection] = useState<[string, number]>(["null", 1]);

    const userData = useRef({ name: "", email: "", image: "" });

    async function UpdateGuest() {
        console.log(userData.current)
    }

    const CancelFooter = <div className='modalFooter' onClick={() => setActualSection(["null", -1])}>
        <CloseIcon />
        <p>Cancelar</p>
    </div>

    const ContinueButton = <Button type="submit" style={{ width: "100%", padding: "0.8rem 3rem" }} >
        Continuar
    </Button>

    function nextSectionWithGuest() {
        if (guest?.email && guest?.image_url) {
            setActualSection(["updating_data", 1])
            UpdateGuest()
        } else if (!guest?.email && guest?.image_url) {
            setActualSection(["direct_invite_guest_email", 1])
        } else if (guest?.email && !guest?.image_url) {
            setActualSection(["direct_invite_guest_image", 1])
        } else {
            setActualSection(["error", -1])
        }
    }

    const ConfirmIdentity = {
        title: "Precisamos confirmar algumas informações",
        description: "Antes de tudo, confira se as informações abaixo pertencem a você.",
        children: <div className={styles.section}>
            {
                guest?.image_url && <Image src={guest.image_url} width={132} height={132} style={GUEST_IMAGE_PLACEHOLDER} alt="" />
            }
            <h4>{guest?.name}</h4>
            <Button type="submit" style={{ width: "100%", padding: "0.8rem 3rem" }} onClick={nextSectionWithGuest}>
                Sou eu, prosseguir
            </Button>
        </div>,
        footer: <div onClick={() => setActualSection(["no_identity", -1])} className='modalFooter'><p className={styles.footer}>Não sou eu</p></div>
    } as Section;

    const NoIdentity = {
        title: "Desculpe pelo engano!",
        description: "Entre em contato com o anfitrião do evento para que o link seja atualizado e/ou você seja adicionado à lista de participantes.\n\ \nCaso você tenha acessado esse link por engano, por favor, desconsidere e feche a janela.",
    } as Section;

    const Error = {
        title: "Eita! Tivemos um problema interno.",
        description: "Entre em contato com o anfitrião do evento para que ele esteja ciente do problema.",
    } as Section;

    const UpdatingData = {
        title: "Tudo certo!\nEstamos atualizando seus dados.",
        description: "Aguarde um momento enquanto terminamos de configurar seu perfil e garantir sua participação no evento.",
        children: <div className={styles.section}>
            <Button isLoading={true} style={{ width: "100%", backgroundColor: "var(--primary-01)" }} />
        </div>,
    } as Section;

    const DirectInviteGuest_email = {
        title: "Parece que ainda não sabemos seu e-mail",
        description: "O anfitrião do evento não informou seu e-mail, portanto, insira-o no campo abaixo para que você possa saber quem foi seu sorteado.",
        children: <form className={styles.section} onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.email = formData.get("email") as string;
            setActualSection(["direct_invite_guest_image", 1]);
        }}>
            <Input name="email" label="E-mail" />
            <Button type="submit" style={{ width: "100%", padding: "0.8rem 3rem" }} >
                Continuar
            </Button>
        </form>,
        footer: CancelFooter
    } as Section;

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<any>(undefined)
    const onSelectFile = useImagePreview(setSelectedFile, setPreview, selectedFile)

    const DirectInviteGuest_image = {
        title: "Parece que o anfitrião não inseriu uma imagem para você",
        description: "O anfitrião do evento não inseriu uma imagem de perfil, portanto, faça o upload abaixo para que ela seja exibida para outros convidados.",
        children: <form className={styles.section} onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.email = formData.get("image") as string;

            setActualSection(["direct_invite_guest_image", 1]);
        }}>
            <label style={GUEST_IMAGE_PLACEHOLDER} htmlFor="guestImageUpload">
                {
                    preview && <Image src={preview} fill alt='' style={{ borderRadius: "50%", objectFit: "cover" }} />
                }
                {
                    !preview && <AddPhotoIcon style={{ width: "5rem", height: "5rem" }} />
                }
            </label>
            <input type={"file"} onChange={onSelectFile} accept="image/png, image/jpeg" style={{ display: "none" }} name="image" id="image" />
            <Button type="submit" style={{ width: "100%", padding: "0.8rem 3rem" }} >
                Continuar
            </Button>
        </form>,
        footer: CancelFooter
    } as Section;

    const InviteGuest_name = {
        title: "Pronto para participar do Amigo Secreto?",
        description: "Insira o seu nome (e o primeiro sobrenome!) no campo abaixo para que os outros participantes saibam que você é!",
        children: <form className={styles.section} onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.name = formData.get("name") as string;

            setActualSection(["invite_guest_email", 1])
        }}>
            <Input name="name" label="Nome" placeholder="Fulano da Silva" style={{ width: "100%" }} />
            {ContinueButton}
        </form>,
        footer: CancelFooter
    } as Section;

    const InviteGuest_email = {
        title: "Para ficar sabendo quem foi seu sorteado, insira seu e-mail",
        description: "Após os convidados terem sido sorteados, você receberá um e-mail informando quem foi seu sorteado!",
        children: <form className={styles.section} onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.email = formData.get("email") as string;

            setActualSection(["invite_guest_email", 1])
        }}>
            <Input name="email" label="E-mail" style={{ width: "100%" }} />
            <Button type="submit" style={{ width: "100%", padding: "0.8rem 3rem" }} >
                Continuar
            </Button>
        </form>,
        footer: CancelFooter
    } as Section;

    const InviteGuest_image = {
        title: "Parece que o anfitrião não inseriu uma imagem para você",
        description: "O anfitrião do evento não inseriu uma imagem de perfil, portanto, faça o upload abaixo para que ela seja exibida para outros convidados.",
        children: <form className={styles.section} onSubmit={(event) => {
            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.email = formData.get("image") as string;
            setActualSection(["invite_guest_image", 1]);
        }}>
            <label style={GUEST_IMAGE_PLACEHOLDER} htmlFor="guestImageUpload">
                {
                    preview && <Image src={preview} fill alt='' style={{ borderRadius: "50%", objectFit: "cover" }} />
                }
                {
                    !preview && <AddPhotoIcon style={{ width: "5rem", height: "5rem" }} />
                }
            </label>
            <input type={"file"} onChange={onSelectFile} accept="image/png, image/jpeg" style={{ display: "none" }} name="image" id="image" />
        </form>,
        footer: CancelFooter
    } as Section;

    const sections = {
        "null": {},
        "confirm_identity": ConfirmIdentity,
        "no_identity": NoIdentity,
        "error": Error,
        "updating_data": UpdatingData,
        "direct_invite_guest_email": DirectInviteGuest_email,
        "direct_invite_guest_image": DirectInviteGuest_image,
        "invite_guest_name": InviteGuest_name,
        "invite_guest_email": InviteGuest_email,
        "invite_guest_image": InviteGuest_image,
    } as { [key: string]: Section | {} };

    return (
        <>
            <Button
                label='PARTICIPAR'
                style={{
                    textTransform: "uppercase",
                    fontFamily: "'Gelasio'",
                    fontStyle: "normal",
                    fontWeight: 700,
                    padding: "1rem 3.5rem",
                    fontSize: "1.8rem"
                }}
                onClick={() => setActualSection([guest ? "confirm_identity" : "invite_guest_name", 1])}
            />
            {
                actualSection !== "null" && <AuthModal hasBackground sections={sections as { [key: string]: Section }} actualSection={actualSection} direction={direction} />
            }
        </>
    )
}