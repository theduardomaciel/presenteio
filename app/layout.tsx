import { cookies } from "next/headers";
import { Metadata } from "next";
import { Judson, Gelasio, Inter } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import GoogleProvider from "./auth/google/GoogleOAuthProvider";

/* const judson = Judson({
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
}); */

const judsonLocal = localFont({
	src: [
		{
			path: "./fonts/Judson/Judson-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Judson/Judson-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-judson",
});

const gelasioLocal = localFont({
	src: [
		{
			path: "./fonts/Gelasio/Gelasio-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Gelasio/Gelasio-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/Gelasio/Gelasio-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/Gelasio/Gelasio-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-gelasio",
});

const inter = Inter({
	weight: "variable",
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
			className={`${isDark ? "dark" : ""} ${gelasioLocal.variable} ${
				judsonLocal.variable
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
