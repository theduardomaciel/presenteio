import { NextRequest } from "next/server";

export default function isAuthenticated(request: NextRequest) {
    const tokenCookie = request.cookies.get("presenteio.token")?.value;
    if (tokenCookie) {
        return true;
    } else {
        return false;
    }
}
