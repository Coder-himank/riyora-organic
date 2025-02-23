import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // List of protected routes
    const protectedRoutes = ["/checkout"];

    // Get the current path
    const { pathname } = req.nextUrl;

    // If user is not authenticated and tries to access protected routes, redirect to login
    if (!session && protectedRoutes.includes(pathname)) {
        const url = new URL("/login", req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Define on which routes the middleware should run
export const config = {
    matcher: ["/checkout"], // Add more protected pages if needed
};
