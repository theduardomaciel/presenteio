import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    /* const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token'); */

    /* const router = useRouter();
    if (!token) {
        router.push(`/`)
    } */

    return (
        children
    )
}
