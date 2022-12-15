'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleProvider({ children, ...props }: { children: React.ReactNode, clientId: string }) {
    return (
        <GoogleOAuthProvider {...props} >
            {children}
        </GoogleOAuthProvider>
    )
}