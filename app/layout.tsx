import './globals.css'

import Image from 'next/image';

// Assets
import background from "../public/images/background.png";

// Fonts
import { Gelasio, Judson } from "@next/font/google";

const gelasio = Gelasio({ subsets: ['latin'], weight: ["400", "500", "600", "700"], variable: '--gelasio-font' });
/* const judson = Judson({ subsets: ['latin'], weight: ["400", "700"], variable: '--judson-font' }); */

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={gelasio.className}>
            <head />
            <body>
                {children}
                <Image src={background} alt="" fill style={{ zIndex: -1 }} draggable={false} />
                {/*  
                <div className={styles.background}>
                    <Blob1 className={styles.blob1} />
                    <Blob2 className={styles.blob2} />
                    <Blob3 className={styles.blob3} />
                </div> 
                */}
            </body>
        </html>
    )
}
