'use client';
import Image from 'next/image';

// Stylesheets
import styles from './styles.module.css';

import Overlay from '../../Overlay';

import AddPhotoIcon from '@public/icons/add_photo.svg';

// Hooks
import { useState } from 'react';
import useImagePreview from 'hooks/useImagePreview';

interface Props {
    event?: Event;
    height?: string;
}

export default function EventDisplay({ event, height }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<any>(undefined)

    const onSelectFile = useImagePreview(setSelectedFile, setPreview, selectedFile)

    return (
        <div className={styles.container} style={{ height: height ? height : "100%" }}>
            {
                event ? <></>
                    :
                    <>
                        {
                            selectedFile && preview && <Image src={preview} fill alt='' style={{ borderRadius: "0.5rem", zIndex: 0, objectFit: "cover" }} />
                        }
                        <Overlay />
                        <label className={styles.iconHolder} htmlFor="eventImageUpload">
                            <AddPhotoIcon />
                        </label>
                        <input type={"file"} onChange={onSelectFile} accept="image/png, image/jpeg" style={{ display: "none" }} name="eventImage" id="eventImageUpload" />
                        {/* <div className={styles.themeSelector}>
                            <div className={styles.themePreview} />
                            <p>Cor de destaque</p>
                        </div> */}
                    </>
            }
        </div>
    )
}
