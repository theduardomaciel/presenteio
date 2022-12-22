import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
    runtime: 'experimental-edge',
};

const COLORS = ['#FF2626', "#FF3D3D", '#FD7979']

export default function GenerateImage(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const hasName = searchParams.has('name');
        const NAME = hasName
            ? searchParams.get('name') as string
            : 'Guest';

        const hasWidth = searchParams.has('width');
        const WIDTH = hasWidth ? parseInt(searchParams.get('width') as string) : 48;

        const RANDOM_COLORS = Array.from({ length: 3 }, () => {
            return COLORS[Math.random() * COLORS.length | 0]
        });

        const INITIALS = NAME.split(' ').map((word) => word[0]).join('');

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: `linear-gradient(45deg, ${RANDOM_COLORS[0]}, ${RANDOM_COLORS[1]}, ${RANDOM_COLORS[2]})`,
                        fontSize: 96,
                        color: "white",
                        fontWeight: 900,
                    }}
                >
                    <div>{INITIALS}</div>
                </div>

            ),
            {
                width: WIDTH,
                height: WIDTH,
            },
        );
    } catch (error: any) {
        console.log(`${error.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}