// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAuthenticated(request: NextRequest) {
	const tokenCookie = request.cookies.get("presenteio.token")?.value;
	if (tokenCookie) {
		return true;
	} else {
		return false;
	}
}

const allowedPaths = [
	"/api/emails/check",
	"/api/emails/send",
	"/api/images/generate/event",
	"/api/auth/login",
	"/api/auth/register",
];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	/* // API
	const accountAuthenticated = isAuthenticated(request);
	if (
		request.nextUrl.pathname.startsWith("/api") &&
		!allowedPaths.includes(request.nextUrl.pathname) &&
		!accountAuthenticated
	) {
		return new NextResponse(
			JSON.stringify({
				success: false,
				message: "Authentication failed.",
			}),
			{ status: 401, headers: { "content-type": "application/json" } }
		);
	} */

	// APP
	if (
		/* request.nextUrl.pathname.length === 1 || */
		(request.nextUrl.pathname.startsWith("/login") ||
			request.nextUrl.pathname.startsWith("/register")) &&
		accountAuthenticated
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (
		request.nextUrl.pathname.startsWith("/dashboard") &&
		!accountAuthenticated
	) {
		if (request.nextUrl.pathname.includes("/compose")) {
			return NextResponse.redirect(new URL("/register", request.url));
		} else {
			console.log("Redirecting to login...");
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/:path", "/dashboard/:path*", "/api/:function*"],
};
