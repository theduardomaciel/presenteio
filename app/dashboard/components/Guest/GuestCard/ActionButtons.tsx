'use client';

// Icons
import ShareIcon from "@public/icons/share.svg";
import SendEmail from "@public/icons/send_email.svg";

import styles from "./styles.module.css";

export default function ActionButtons() {
    return (
        <div className={styles.actions}>
            <SendEmail width={22} height={22} />
            <ShareIcon width={22} height={22} />
        </div>
    )
}