'use client';

import UserIcon from '../../../public/icons/person.svg';
import Button from "../../../components/Button";
import Modal from '../../../components/Modal';

import GroupAddIcon from "../../../public/icons/group_add.svg";

// Types
import Guest from '../../../types/Guest';
import Input from '../../../components/Input';

interface Props {
    guest?: Guest;

    isVisible: boolean;
    toggleVisibility: () => void;
}

function GuestModal({ guest, isVisible, toggleVisibility }: Props) {

    function onSubmit() {

    }

    return <Modal
        isVisible={isVisible}
        toggleVisibility={toggleVisibility}
        title="Adicionar participante"
    >
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <input type={"image"} style={{
                width: "13rem",
                height: "13rem",
                borderRadius: "50%",
                backgroundColor: "var(--primary-02)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer"
            }}>
                <UserIcon width={`5.6rem`} heigth={`5.6rem`} />
            </input>
            <Input label='Nome Completo*' />
            <Input label='E-mail*' />
            <Button type="submit" label='Adicionar' icon={<GroupAddIcon />} />
        </form>
    </Modal>
}

export default GuestModal;