'use client';
import { useState } from 'react';

import styles from './styles.module.css';

// Components
import EmptyGuests from './EmptyGuests';
import DashboardSectionHeader from '../SectionHeader';
import Button from '../../../../components/Button';

// Icons
import AddIcon from '../../../../public/icons/add.svg';
import GuestModal from '../GuestModal';

import Guest from '../../../../types/Guest';

interface Props {
    hasAddButton?: boolean;
}

export default function GuestsDisplay({ hasAddButton }: Props) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

    return <>
        <DashboardSectionHeader title="Participantes">
        </DashboardSectionHeader>
        {hasAddButton && <Button label='Adicionar participante' icon={< AddIcon />} onClick={() => setIsGuestModalVisible(true)} style={{ width: "100%", paddingBlock: "0.5rem" }} />}
        <div className={styles.guestsHolder}>
            <EmptyGuests label='Você não adicionou nenhum convidado previamente.' style={{ paddingBlock: "5rem" }} />
        </div>
        <GuestModal isVisible={isGuestModalVisible} toggleVisibility={() => setIsGuestModalVisible(!isGuestModalVisible)} />
    </>
}