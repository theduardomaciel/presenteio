
import Image, { ImageLoader, ImageLoaderProps } from 'next/image';

// Stylesheets
import styles from './profile.module.css';

// Icons
import DashboardProfileMenu from './Menu';

// Types
import { getAccount } from '@utils/getAccount';

interface Props {
    children?: React.ReactNode;
    additionalClasses?: string;
}

const contentfulImageLoader: ImageLoader = ({ src, width }: ImageLoaderProps) => {
    return `${src}?w={width}`
}

export default async function DashboardProfile({ children, additionalClasses }: Props) {
    const account = await getAccount();

    const imageProps = {
        className: styles.profileImage,
        width: 36,
        height: 36,
        alt: ""
    }

    const PLACEHOLDER_IMAGE_URL = process.env.NODE_ENV === 'development' ? `http://localhost:3000/api/images/generateProfileImage?name=${account?.name.replaceAll(' ', '%20')}`
        : `https://presenteio.vercel.app/api/images/generateProfileImage?name=${account?.name.replaceAll(' ', '%20')}`;

    return (
        <div className={`${styles.container} ${additionalClasses}`} style={children ? {} : { width: "15%" }}>
            {children}
            <div className={styles.profileHolder}>
                {
                    account?.image_url ?
                        <Image src={account.image_url} {...imageProps} />
                        :
                        <Image
                            loader={contentfulImageLoader}
                            src={PLACEHOLDER_IMAGE_URL}
                            {...imageProps}
                        />
                }
                <DashboardProfileMenu name={account?.name} />
            </div>
        </div>
    )
}