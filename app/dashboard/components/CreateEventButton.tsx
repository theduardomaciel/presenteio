'use client';

import AddIcon from '../../../public/icons/add.svg';
import Button from "../../../components/Button";
import Link from 'next/link';

const CreateEventButton = () => <Link href={`/dashboard/compose`}>
    <Button label='Criar evento' icon={<AddIcon />} style={{ padding: `0.8rem 3rem`, fontWeight: 700 }} />
</Link>

export default CreateEventButton;