import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ToastProvider } from 'components/Toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');

    if (!token) {
        redirect(`/`)
    }

    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    )
}
