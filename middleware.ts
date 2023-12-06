// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	// Get the path of the request
	const path = request.nextUrl.pathname;

	// Check if the path is public or not
	const isPublicPath = path === "/login" || path === "/register";

	// Get the token from the cookies
	const token = request.cookies.get("presenteio.token")?.value || "";

	// Check if the user is logged in or not
	if (isPublicPath && token.length > 0) {
		console.log("User is logged in.");
		return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
	}

	if (!isPublicPath && path !== "/" && !(token.length > 0)) {
		console.log("User is not logged in.");
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/:path", "/dashboard/:path*" /* "/api/:function*" */],
};
