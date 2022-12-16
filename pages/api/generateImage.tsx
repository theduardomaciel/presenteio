import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
    runtime: 'experimental-edge',
};

export default function GenerateImage(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    const RANDOM_COLORS = Array.from({ length: 3 }, () => {
        return {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
        }
    });

    console.log(RANDOM_COLORS)

    const NAME = name as string;
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
                    backgroundImage: `linear-gradient(45deg, rgb(${RANDOM_COLORS[0].r}, ${RANDOM_COLORS[0].g}, ${RANDOM_COLORS[0].b}), rgb(${RANDOM_COLORS[1].r}, ${RANDOM_COLORS[1].g}, ${RANDOM_COLORS[0].b}), rgb(${RANDOM_COLORS[2].r}, ${RANDOM_COLORS[2].g}, ${RANDOM_COLORS[2].b}))`,
                    fontSize: 96,
                    color: "white",
                    fontFamily: '"Arial"',
                    fontWeight: 900,
                }}
            >
                <div>{INITIALS}</div>
            </div>

        ),
        {
            width: 250,
            height: 250,
        },
    );
}