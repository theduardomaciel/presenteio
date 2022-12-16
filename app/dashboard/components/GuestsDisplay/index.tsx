'use client';
import { Dispatch, MutableRefObject, RefObject, SetStateAction, useRef, useState } from 'react';

import styles from './styles.module.css';

// Components
import EmptyGuests from './EmptyGuests.tsx';
import DashboardSectionHeader from '../SectionHeader';
import Button from '../../../../components/Button';
import GuestModal from '../GuestModal';

// Icons
import MailIcon from '../../../../public/icons/mail.svg';
import AddIcon from '../../../../public/icons/add.svg';
import EditFilledIcon from '../../../../public/icons/edit_filled.svg';

import Guest from '../../../../types/Guest';
import Image from 'next/image';

interface Props {
    hasAddButton?: boolean;
}

export interface PreGuest {
    name: string;
    email?: string;
    image?: File;
    imagePreview?: string;
}

const PreGuestPreview = ({ guest, currentPreGuest, setIsGuestModalVisible }: { guest: PreGuest, currentPreGuest: MutableRefObject<PreGuest | null>, setIsGuestModalVisible: Dispatch<SetStateAction<boolean>> }) => {
    return <div className={styles.guestPreview}>
        <div className={styles.guestInfo} >
            {
                guest.imagePreview && <Image src={guest.imagePreview} style={{ borderRadius: "50%" }} width={28} height={28} alt={guest.name} />
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
                currentPreGuest.current = guest;
                setIsGuestModalVisible(true);
            }} />
        </div>
    </div>
}

export default function GuestsDisplay({ hasAddButton }: Props) {
    const [preGuests, setPreGuests] = useState<PreGuest[]>([]);

    const currentPreGuest = useRef<PreGuest>(null) as MutableRefObject<PreGuest | null>;
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

    return <>
        <DashboardSectionHeader title="Participantes">
        </DashboardSectionHeader>
        {hasAddButton && <Button
            label='Adicionar participante'
            icon={< AddIcon />}
            onClick={() => {
                currentPreGuest.current = null;
                setIsGuestModalVisible(true)
            }}
            style={{ width: "100%", paddingBlock: "0.5rem" }}
        />}
        <div className={`${styles.guestsHolder} ${preGuests.length === 0 ? styles.empty : ""}`}>
            {
                preGuests.length === 0 ?
                    <EmptyGuests label='Você não adicionou nenhum convidado previamente.' style={{ paddingBlock: "5rem" }} />
                    :
                    preGuests.map((guest, index) => <PreGuestPreview
                        key={index.toString()}
                        guest={guest}
                        currentPreGuest={currentPreGuest}
                        setIsGuestModalVisible={setIsGuestModalVisible}
                    />)
            }
        </div>
        <GuestModal setPreGuests={setPreGuests} isVisible={isGuestModalVisible} modalProps={{ preGuest: currentPreGuest.current }} toggleVisibility={() => setIsGuestModalVisible(!isGuestModalVisible)} />
    </>
}