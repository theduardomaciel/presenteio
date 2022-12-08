'use client';

import { Typewriter } from 'react-simple-typewriter'

interface Props {
    subtitles: string[]
}

export default function TypewrittenText({ subtitles }: Props) {
    return (
        <Typewriter
            words={subtitles}
            loop={0}
            typeSpeed={80}
            deleteSpeed={120}
            delaySpeed={3000}
        />
    );
}