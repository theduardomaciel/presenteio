import { cookies } from "next/headers";
import { Metadata } from "next";
import { Judson, Gelasio, Inter } from "next/font/google";

import "./globals.css";

import GoogleProvider from "./auth/google/GoogleOAuthProvider";

const judson = Judson({
	subsets: ["latin-ext"],
	display: "swap",
	variable: "--font-judson",
	weight: ["400", "700"],
});

const gelasio = Gelasio({
	subsets: ["latin-ext"],
	display: "swap",
	variable: "--font-gelasio",
	weight: ["400", "500", "600", "700"],
});

const inter = Inter({
	subsets: ["latin-ext"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "presenteio",
	description:
		"A platform for automating social events that seeks to help create good moments in an easy and practical way.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isDark = cookies().get("theme")?.value == "dark";

	return (
		<html
			className={`${isDark ? "dark" : ""} ${gelasio.variable} ${
				judson.variable
			} ${inter.variable}`}
			lang="pt-br"
		>
			<body>
				<GoogleProvider
					clientId={process.env.GOOGLE_CLIENT_ID as string}
				>
					{children}
				</GoogleProvider>
			</body>
		</html>
	);
}
