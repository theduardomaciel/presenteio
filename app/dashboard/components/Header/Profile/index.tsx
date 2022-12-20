
import Image from 'next/image';

// Stylesheets
import styles from './profile.module.css';

// Icons
import DashboardProfileMenu from './Menu';

// Types
import { getAccount } from '@utils/getAccount';

/* async function getAccount() {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');

    if (!token) return;

    const response = decode(token?.value as string) as { data: string }

    if (response) {
        console.log("Atualizando conta...")
        const account = await prisma.account.findUnique({
            where: {
                id: response.data as string
            }
        });

        return account;
    }
} */

/* async function getAccount() {
    const nextCookies = cookies();
    const tokenCookie = nextCookies.get('presenteio.token');

    if (!tokenCookie) {
        redirect(`/landing`)
    };

    const URL = process.env.NODE_ENV === 'development' ? `http://localhost:3000/api/accounts/${tokenCookie.value}` : `https://presenteio.vercel.app/api/accounts/${tokenCookie.value}`;
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tokenCookie.value}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    console.log("Atualizando pelo servidor.")
    return response.json();
} */

interface Props {
    children?: React.ReactNode;
    additionalClasses?: string;
}

async function DashboardProfile({ children, additionalClasses }: Props) {
    const account = await getAccount('teste');

    const PLACEHOLDER_IMAGE_URL = process.env.NODE_ENV === 'development' ? `http://localhost:3000/api/images/generateProfileImage?name=${account?.name.replaceAll(' ', '%20')}`
        : `https://presenteio.vercel.app/api/images/generateProfileImage?name=${account?.name.replaceAll(' ', '%20')}`;

    return (
        <div className={`${styles.container} ${additionalClasses}`} style={children ? {} : { width: "15%" }}>
            {children}
            <div className={styles.profileHolder}>
                <Image className={styles.profileImage} src={account?.image_url ? account.image_url : PLACEHOLDER_IMAGE_URL} width={36} height={36} alt='' />
                <DashboardProfileMenu name={account?.name} />
            </div>
        </div>
    )
}

export default DashboardProfile;