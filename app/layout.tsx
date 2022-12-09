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
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Judson:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}
