'use client';
import Image from 'next/image';

// Stylesheets
import styles from './styles.module.css';

import Overlay from '../Overlay';

import AddPhotoIcon from '../../../../public/icons/add_photo.svg';

interface Props {
    event?: Event;
    height?: string;
}

export default function EventDisplay({ event, height }: Props) {
    return (
        <div className={styles.container} style={{ height: height ? height : "23rem" }}>
            {
                event ? <></>
                    :
                    <>
                        <div className={styles.iconHolder}>
                            <AddPhotoIcon />
                        </div>
                        <div className={styles.themeSelector}>
                            <div className={styles.themePreview} />
                            <p>Cor de destaque</p>
                        </div>
                    </>
            }
        </div>
    )
}
