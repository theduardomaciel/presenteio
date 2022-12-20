import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { CSSProperties } from 'react';

export const config = {
    runtime: 'experimental-edge',
};

const gelasio = fetch(new URL('./assets/Gelasio_BoldItalic.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
);

const judson = fetch(new URL('./assets/Judson_Regular.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
    const gelasioFontData = await gelasio;
    const judsonFontData = await judson;

    try {
        const { searchParams } = new URL(req.url)
        console.log(searchParams.get("name"))
        let name = searchParams.get('name') as string;
        let type = searchParams.get('type') as string;

        if (!name) {
            name = ""
        }

        if (!type) {
            type = ""
        }

        return new ImageResponse(
            (
                <div style={holder}>
                    <svg width="48" height="48" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.88 7.61715H21.714C22.19 6.84825 22.47 5.93563 22.47 4.95833C22.47 2.22406 20.3035 0 17.64 0C16.191 0 14.8855 0.661111 14 1.70308C13.1145 0.661111 11.809 -3.14387e-08 10.36 0C7.6965 0 5.53 2.22406 5.53 4.95833C5.53 5.93563 5.8065 6.84825 6.286 7.61715H1.12C0.5005 7.61715 -3.06241e-08 8.13095 0 8.76691V15.9529C0 16.111 0.126 16.2403 0.28 16.2403H1.68V28.6002C1.68 29.2362 2.1805 29.75 2.8 29.75H25.2C25.8195 29.75 26.32 29.2362 26.32 28.6002V16.2403H27.72C27.874 16.2403 28 16.111 28 15.9529V8.76691C28 8.13095 27.4995 7.61715 26.88 7.61715ZM12.81 27.3068H4.06V16.2403H12.81V27.3068ZM12.81 13.7971H2.38V10.0604H12.81V13.7971ZM12.81 7.47343H10.36C9.009 7.47343 7.91 6.34523 7.91 4.95833C7.91 3.57144 9.009 2.44324 10.36 2.44324C11.711 2.44324 12.81 3.57144 12.81 4.95833V7.47343ZM15.19 4.95833C15.19 3.57144 16.289 2.44324 17.64 2.44324C18.991 2.44324 20.09 3.57144 20.09 4.95833C20.09 6.34523 18.991 7.47343 17.64 7.47343H15.19V4.95833ZM23.94 27.3068H15.19V16.2403H23.94V27.3068ZM25.62 13.7971H15.19V10.0604H25.62V13.7971Z" fill="#FF3D3D" />
                    </svg>
                    <h2 style={h2}>{type === "AMIGOSECRETO" ? "Amigo Secreto" : "Sorteio"}</h2>
                    <h3 style={h3}>d{name.split(' ')[0].charAt(name.split(' ')[0].length - 1) === "a" ? "a" : "o"} {name}</h3>
                </div>
            ),
            {
                width: 600,
                height: 200,
                fonts: [
                    {
                        name: 'Gelasio',
                        data: gelasioFontData,
                        style: 'italic',
                    },
                    {
                        name: 'Judson',
                        data: judsonFontData,
                        style: 'normal',
                    },
                ],
            },
        )
    } catch (error: any) {
        console.log(`${error.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}

const holder = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
} as CSSProperties

const h2 = {
    fontFamily: "'Gelasio'",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: 56,
    color: "#FF2626"
} as CSSProperties;

const h3 = {
    fontFamily: "'Judson'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 21,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: 'transparent',
    background: 'linear-gradient(180deg, #FF3D3D 0%, #FF8C8C 100%)',
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent"
} as CSSProperties;