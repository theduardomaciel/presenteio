'use client';
import { useState } from 'react';

import Image from 'next/image';
import useSWR from "swr";

// Stylesheets
import styles from './profile.module.css';

// Icons
import DownArrow from '../../../../public/icons/down_arrow.svg';
import DashboardProfileMenu from './Menu';
import Account from '../../../../types/Account';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw Error("There was not possible to get the image from the server.");
    }
    const data = await res.json();
    return data;
};

export default function DashboardProfile({ account, children }: { account: Account | undefined, children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleOpen() {
        setIsOpen(!isOpen);
    }

    if (!account) {
        return <div></div>;
    }

    const result = useSWR(`/api/generateImage?name=${account.name}`, fetcher);
    console.log(result.data);

    return (
        <div className={styles.container} style={children ? {} : { width: "15%" }}>
            {children}
            <div className={styles.profileHolder}>
                <Image className={styles.profileImage} src={result.data} width={36} height={36} alt='' />
                <DownArrow onClick={toggleOpen} />
                <DashboardProfileMenu isOpen={isOpen} account={account} toggleOpen={toggleOpen} />
            </div>
        </div>
    )
}
