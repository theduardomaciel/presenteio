import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');

    if (!token) {
        redirect(`/`)
    }

    return (
        children
    )
}
