'use client';
import { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';

// Components
import Button from "components/Button";
import Modal from 'components/Modal';
import Input from 'components/Input';
import { PreGuest } from './PreGuestsDisplay';

// Icons
import UserIcon from '@public/icons/person.svg';
import GroupAddIcon from "@public/icons/group_add.svg";
import EditFilledIcon from '@public/icons/edit_filled.svg';

// Types
import Guest from 'types/Guest';

// Hooks
import useImagePreview from 'hooks/useImagePreview';

export const GUEST_IMAGE_PLACEHOLDER = {
    width: "13rem",
    height: "13rem",
    borderRadius: "50%",
    backgroundColor: "var(--primary-02)",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    cursor: "pointer"
} as CSSProperties;

interface Props {
    isVisible: boolean;
    modalProps?: {
        guest?: Guest,
        preGuest?: PreGuest,
        setPreGuests?: React.Dispatch<React.SetStateAction<PreGuest[]>>,
    };
    toggleVisibility: () => void;
}

// código do preview de imagem: https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react

function GuestModal({ isVisible, modalProps, toggleVisibility }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<any>(undefined)

    const [guestName, setGuestName] = useState<string>("");
    const [guestEmail, setGuestEmail] = useState<string>("");

    const onSelectFile = useImagePreview(setSelectedFile, setPreview, selectedFile, true)

    useEffect(() => {
        setGuestName(modalProps ? modalProps.guest?.name || modalProps.preGuest?.name || "" : "")
        setGuestEmail(modalProps ? modalProps.guest?.email || modalProps.preGuest?.email || "" : "")
        setPreview(modalProps && modalProps.preGuest ? modalProps.preGuest.imagePreview : undefined)
    }, [isVisible])

    function onSubmit() {
        if (modalProps?.setPreGuests) {
            if (modalProps && modalProps.preGuest) {
                modalProps.setPreGuests(prev => {
                    let newPreGuests = [...prev];
                    newPreGuests[prev.indexOf(modalProps.preGuest as PreGuest)] = { name: guestName, email: guestEmail, image: selectedFile, imagePreview: preview };
                    return newPreGuests;
                })
            } else {
                modalProps.setPreGuests(prev => prev.concat({ name: guestName, email: guestEmail, image: selectedFile, imagePreview: preview }));
            }
            toggleVisibility()
        }
    }

    return (
        <Modal
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            title="Adicionar participante"
        >
            <div>
                <label style={GUEST_IMAGE_PLACEHOLDER} htmlFor="guestImageUpload">
                    {
                        preview && <Image src={preview} fill alt='' style={{ borderRadius: "50%", objectFit: "cover" }} />
                    }
                    {
                        !preview && <UserIcon style={{ width: "5rem", height: "5rem" }} />
                    }
                </label>
                <input type={"file"} onChange={onSelectFile} accept="image/png, image/jpeg" style={{ display: "none" }} name="guestImage" id="guestImageUpload" />
            </div>
            <Input
                label='Nome*'
                type={"text"}
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                maxLength={30}
                required
            />
            <Input
                label='E-mail'
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                type={'email'}
            />
            <Button
                onClick={onSubmit}
                style={{ width: "100%", padding: "0.8rem 3rem" }}
            >
                {modalProps?.preGuest || modalProps?.guest ? <EditFilledIcon width={"1.8rem"} height={"1.8rem"} /> : <GroupAddIcon />}
                {modalProps?.preGuest || modalProps?.guest ? "Editar" : "Adicionar"}
            </Button>
        </Modal>
    )
}

export default GuestModal;