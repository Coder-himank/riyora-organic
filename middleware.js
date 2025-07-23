// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log("url", req.nextUrl);
    if (!token) {
        if (req.nextUrl.pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loginUrl = new URL("/authenticate?pageType=login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.url.startsWith("/[userId]") ? "/" : req.Url); // Optional: redirect back after login
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/api/secure/:path*",
        "/profile/:path*",
        "/checkout/:path*",
        "/cart/:path*",
        "/wishlist/:path*",
    ],
};
