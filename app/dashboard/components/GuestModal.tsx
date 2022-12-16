'use client';
import { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';

// Components
import Button from "../../../components/Button";
import Modal from '../../../components/Modal';

// Icons
import UserIcon from '../../../public/icons/person.svg';
import GroupAddIcon from "../../../public/icons/group_add.svg";
import EditFilledIcon from '../../../public/icons/edit_filled.svg';

// Types
import Guest from '../../../types/Guest';
import Input from '../../../components/Input';

import { PreGuest } from './GuestsDisplay';

const MODAL_STYLES = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2.5rem",
    width: "100%",
} as CSSProperties;

interface Props {
    setPreGuests?: React.Dispatch<React.SetStateAction<PreGuest[]>>;
    isVisible: boolean;
    modalProps: { guest?: Guest, preGuest?: PreGuest | null };
    toggleVisibility: () => void;
}

// código do preview de imagem: https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react

function GuestModal({ setPreGuests, isVisible, modalProps, toggleVisibility }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(modalProps.preGuest && modalProps.preGuest !== null ? modalProps.preGuest.image : undefined)
    const [preview, setPreview] = useState<any>(modalProps.preGuest && modalProps.preGuest !== null ? modalProps.preGuest.imagePreview : undefined)

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formGuestData = Object.fromEntries(formData.entries()) as unknown as any;
        console.log(formGuestData);

        if (setPreGuests) {
            if (modalProps.preGuest && modalProps.preGuest !== null) {
                console.log("editando")
                setPreGuests(prev => {
                    let newPreGuests = [...prev];
                    newPreGuests[prev.indexOf(modalProps.preGuest as PreGuest)] = { name: formGuestData.guestName, email: formGuestData.guestEmail, image: selectedFile, imagePreview: preview };
                    return newPreGuests;
                })
                console.log("editou")
            } else {
                setPreGuests(prev => prev.concat({ name: formGuestData.guestName, email: formGuestData.guestEmail, image: selectedFile, imagePreview: preview }));
            }
            toggleVisibility()
        }
    }

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        console.log(selectedFile, objectUrl)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => {
            console.log("unmounted")
            URL.revokeObjectURL(objectUrl)
        }
    }, [selectedFile, modalProps])

    const onSelectFile = (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(event.target.files[0])
    }

    console.log(preview)

    return <Modal
        isVisible={isVisible}
        toggleVisibility={toggleVisibility}
        title="Adicionar participante"
    >
        <form onSubmit={onSubmit} encType="multipart/form-data" style={MODAL_STYLES}>
            <div>
                <label style={{
                    width: "13rem",
                    height: "13rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-02)",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    alignItems: "center",
                    cursor: "pointer"
                }} htmlFor="guestImageUpload">
                    {
                        selectedFile && preview && <Image src={preview} fill alt='' style={{ borderRadius: "50%", objectFit: "cover" }} />
                    }
                    {
                        !selectedFile && <UserIcon style={{ width: "5rem", height: "5rem" }} />
                    }
                </label>
                <input type={"file"} onChange={onSelectFile} accept=".png,.jpg,.jpeg,.webp" style={{ display: "none" }} name="guestImage" id="guestImageUpload" />
            </div>
            <Input
                label='Nome*'
                name='guestName'
                defaultValue={modalProps ? modalProps.guest?.name || modalProps.preGuest?.name : undefined}
                maxLength={30}
                required
            />
            <Input
                label='E-mail'
                name='guestEmail'
                defaultValue={modalProps ? modalProps.guest?.email || modalProps.preGuest?.email : undefined}
                type={'email'}
            />
            <Button type="submit" label={modalProps ? "Editar" : "Adicionar"} icon={modalProps ? <EditFilledIcon width={"1.8rem"} heigth={"1.8rem"} /> : <GroupAddIcon />} style={{ width: "100%", padding: "0.8rem 3rem" }} />
        </form>
    </Modal>
}

export default GuestModal;