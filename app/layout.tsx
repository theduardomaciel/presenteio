import './globals.css'

import { cookies } from 'next/headers';
import GoogleProvider from './auth/google/GoogleOAuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const nextCookies = cookies();
    const theme = nextCookies.get('theme')?.value;

    const isDark = theme && theme === "dark";
    return (
        <html className={`${isDark ? 'dark' : ""}`} lang="pt-br">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />

                <link href="https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Judson:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
            </head>
            <body>
                <GoogleProvider clientId={process.env.GOOGLE_CLIENT_ID as string}>
                    {children}
                </GoogleProvider>
            </body>
        </html>
    )
}
