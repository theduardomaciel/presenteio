'use client';

import GoogleLogo from '@public/icons/google.svg';
import Button from "components/Button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export default function GoogleButton(props: Props) {
    return (
        <Button
            type='button'
            style={{
                padding: "1.2rem",
                gap: "3rem",
                backgroundColor: "var(--neutral)",
                border: "1px solid var(--light-gray)",
                color: "var(--font-light)",
                fontFamily: "Arial",
                width: "100%",
                fontWeight: 700,
                fontSize: "1.4rem",
                boxShadow: "0px 4px 15px 2px rgba(0, 0, 0, 0.1)",
                borderRadius: "0.5rem",
            }}
            accentColor={`var(--primary-01)`}
            {...props}
        >
            <GoogleLogo />
            Entrar com Google
        </Button >
    )
}
