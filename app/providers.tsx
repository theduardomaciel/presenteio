"use client";

import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface Props {
	children: React.ReactNode;
	clientId: string;
}

export function Providers({ children, clientId }: Props) {
	return (
		<ThemeProvider attribute="class" defaultTheme="light">
			<GoogleOAuthProvider clientId={clientId}>
				{children}
			</GoogleOAuthProvider>
		</ThemeProvider>
	);
}
