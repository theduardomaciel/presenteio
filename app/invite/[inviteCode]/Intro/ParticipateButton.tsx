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

    const CancelFooter = <div className='modalFooter' onClick={() => setActualSection(["null", -1])}>
        <CloseIcon />
        <p>Cancelar</p>
    </div>

    const ContinueButton = <Button type="submit" style={{ width: "100%", padding: "0.8rem 3rem" }} >
        Continuar
    </Button>

    const NoIdentity = {
        title: "Desculpe pelo engano!",
        description: "Entre em contato com o anfitrião do evento para que o link seja atualizado e/ou você seja adicionado à lista de participantes.",
    } as Section;

    const ConfirmIdentity = {
        title: "Vamos criar sua conta",
        description: "Antes de podermos criar, precisamos que você escolha como vai querer entrar na plataforma.",
        children: <div className={styles.section}>

        </div>,
        footer: <div className='modalFooter'><p className={styles.footer}>Não sou eu</p></div>
    } as Section;

    const DirectInviteGuest_email = {
        title: "Parece que ainda não sabemos seu e-mail",
        description: "O anfitrião do evento não informou seu e-mail, portanto, insira-o no campo abaixo para que você possa saber quem foi seu sorteado.",
        children: <form className={styles.section} onSubmit={(event) => {
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
            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.name = formData.get("name") as string;
            setActualSection(["invite_guest_email", 1])
        }}>
            <Input name="name" label="Nome" placeholder="Fulano da Silva" />
            {ContinueButton}
        </form>,
        footer: CancelFooter
    } as Section;

    const InviteGuest_email = {
        title: "Para ficar sabendo quem foi seu sorteado, insira seu e-mail",
        description: "Após os convidados terem sido sorteados, você receberá um e-mail informando quem foi seu sorteado!",
        children: <form className={styles.section} onSubmit={(event) => {
            const formData = new FormData(event.target as HTMLFormElement);
            userData.current.email = formData.get("email") as string;
            setActualSection(["invite_guest_email", 1])
        }}>
            <Input name="email" label="E-mail" />
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
        "null": null,
        "confirm_identity": ConfirmIdentity,
        "no_identity": NoIdentity,
        "direct_invite_guest_email": DirectInviteGuest_email,
        "direct_invite_guest_image": DirectInviteGuest_image,
        "invite_guest_name": InviteGuest_name,
        "invite_guest_email": InviteGuest_email,
        "invite_guest_image": InviteGuest_image,
    } as { [key: string]: Section | null };

    return <>
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
        />
        {
            actualSection !== "null" && <AuthModal sections={sections as { [key: string]: Section }} actualSection={actualSection} direction={direction} />
        }
    </>
}