import './globals.css'

// Fonts
import { Gelasio, Judson } from "@next/font/google";
const gelasio = Gelasio({ subsets: ['latin'], weight: ["400", "500", "600", "700"], variable: '--gelasio-font' });
/* const judson = Judson({ subsets: ['latin'], weight: ["400", "700"], variable: '--judson-font' }); */

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br" className={gelasio.className}>
            <head />
            <body>
                {children}
            </body>
        </html>
    )
}
