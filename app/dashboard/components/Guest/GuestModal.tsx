'use client';
import { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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

import { extractBase64, toBase64 } from '@utils/base64';

export const GUEST_IMAGE_PLACEHOLDER = {
    width: "13rem",
    height: "13rem",
    borderRadius: "50%",
    backgroundColor: "var(--primary-02)",
    display: "flex",
    objectFit: "cover",
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    cursor: "pointer"
} as CSSProperties;

interface Props {
    isVisible: boolean;
    modalProps?: {
        guest?: Guest,
        postFunction?: () => void,
        preGuest?: PreGuest,
        eventId?: number,
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
        setPreview(modalProps && (modalProps?.preGuest?.imagePreview || modalProps?.guest?.image_url) ? modalProps.preGuest?.imagePreview || modalProps.guest?.image_url : undefined)
    }, [isVisible])

    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit() {
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
        } else if (modalProps?.guest) {
            setLoading(true)

            const image_base64 = selectedFile ? await toBase64(selectedFile as File) as string : null;
            const extractedImage = image_base64 ? extractBase64(image_base64) : null;

            const guest = { name: guestName, email: guestEmail, image_deleteHash: modalProps.guest.image_deleteHash, image_base64: extractedImage }

            try {
                const response = await axios.patch(`/api/guests/${modalProps.guest.id}`, guest);
                setLoading(false)
                toggleVisibility()
                if (response) {
                    router.refresh();
                    modalProps.postFunction && modalProps.postFunction();
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        } else if (modalProps?.eventId) {
            setLoading(true)

            const image_base64 = selectedFile ? await toBase64(selectedFile as File) as string : null;
            const extractedImage = image_base64 ? extractBase64(image_base64) : null;

            const guest = {
                eventId: modalProps.eventId,
                name: guestName,
                email: guestEmail,
                image_base64: extractedImage
            }

            try {
                const response = await axios.post(`/api/guests/create`, guest);
                setLoading(false)
                toggleVisibility()
                if (response) {
                    router.refresh();
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
    }

    return (
        <Modal
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            headerProps={{
                title: "Adicionar participante"
            }}
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
                <input
                    type={"file"}
                    onChange={onSelectFile}
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    id='guestImageUpload'
                    name="guestImage"
                />
            </div>
            <Input
                label='Nome*'
                type={"text"}
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                minLength={6}
                maxLength={30}
                required
            />
            <Input
                label='E-mail'
                value={guestEmail}
                minLength={8}
                onChange={e => setGuestEmail(e.target.value)}
                type={'email'}
            />
            <Button
                onClick={onSubmit}
                isLoading={isLoading}
                style={{ width: "100%", padding: "0.8rem 3rem" }}
            >
                {modalProps?.preGuest || modalProps?.guest ? <EditFilledIcon width={"1.8rem"} height={"1.8rem"} /> : <GroupAddIcon />}
                {modalProps?.preGuest || modalProps?.guest ? "Editar" : "Adicionar"}
            </Button>
        </Modal>
    )
}

export default GuestModal;