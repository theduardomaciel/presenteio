'use client';
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';
import Image from 'next/image';

import styles from './styles.module.css';

// Components
import EmptyGuests from '../EmptyGuests';
import DashboardSectionHeader from '@dashboard/components/Section/SectionHeader';
import Button from 'components/Button';
import GuestModal from '../GuestModal';

// Icons
import MailIcon from '@public/icons/mail.svg';
import AddIcon from '@public/icons/add.svg';
import EditFilledIcon from '@public/icons/edit_filled.svg';

interface Props {
    preGuests: PreGuest[];
    setPreGuests: Dispatch<SetStateAction<PreGuest[]>>;
    hasAddButton?: boolean;
}

export interface PreGuest {
    name: string;
    email?: string;
    image?: File;
    imagePreview?: string;
}

export const AddGuestButton = ({ setIsGuestModalVisible, fullWidth }: { setIsGuestModalVisible: Dispatch<SetStateAction<boolean>>, fullWidth?: boolean }) => <Button
    label='Adicionar participante'
    icon={< AddIcon />}
    onClick={() => {
        setIsGuestModalVisible(true);
    }}
    style={{ width: fullWidth ? "100%" : "fit-content", paddingBlock: "0.5rem" }}
/>

const PreGuestPreview = ({ guest, setCurrentPreGuest, toggleVisibility }: {
    guest: PreGuest,
    toggleVisibility: () => void,
    setCurrentPreGuest: Dispatch<SetStateAction<PreGuest>>,
}) => {
    console.log(guest.imagePreview)
    return <div className={styles.guestPreview}>
        <div className={styles.guestInfo} >
            {
                guest.imagePreview && guest.imagePreview.includes('http') && <Image src={guest.imagePreview} style={{ borderRadius: "50%", objectFit: "cover" }} width={28} height={28} alt={guest.name} />
            }
            <p>{guest.name}</p>
            <div className='divisor' style={{ borderColor: "var(--neutral)", width: 1, height: "1.5rem", opacity: 0.7 }} />
            <div className={styles.iconHolder}>
                <MailIcon />
                <span>{guest.email ? guest.email : "[pendente]"}</span>
            </div>
        </div>
        <div className={styles.actions}>
            <EditFilledIcon onClick={() => {
                setCurrentPreGuest(guest);
                toggleVisibility()
            }} />
        </div>
    </div>
}

export default function GuestsDisplay({ preGuests, setPreGuests, hasAddButton }: Props) {
    const [currentPreGuest, setCurrentPreGuest] = useState<PreGuest | undefined>(undefined);
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

    const toggleVisibility = () => {
        if (isGuestModalVisible) {
            console.log("Limpando currentPreGuest")
            setCurrentPreGuest(undefined);
        }
        setIsGuestModalVisible(!isGuestModalVisible)
    }

    return <>
        <DashboardSectionHeader title="Participantes">
        </DashboardSectionHeader>
        {hasAddButton && <AddGuestButton setIsGuestModalVisible={setIsGuestModalVisible} fullWidth />}
        <div className={`${styles.guestsHolder} ${preGuests.length === 0 ? styles.empty : ""}`}>
            {
                preGuests.length === 0 ?
                    <EmptyGuests label='Você não adicionou nenhum convidado previamente.' style={{ paddingBlock: "5rem" }} />
                    :
                    preGuests.map((guest, index) => <PreGuestPreview
                        key={index.toString()}
                        guest={guest}
                        toggleVisibility={toggleVisibility}
                        setCurrentPreGuest={setCurrentPreGuest}
                    />)
            }
        </div>
        <GuestModal
            isVisible={isGuestModalVisible}
            modalProps={{ preGuest: currentPreGuest, setPreGuests: setPreGuests }}
            toggleVisibility={toggleVisibility}
        />
    </>
}