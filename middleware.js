// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ====== Rate Limit Settings ======
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 300; // 60 requests per minute per IP
const ipStore = new Map();

export async function middleware(req) {
    const res = NextResponse.next();
    const { pathname, searchParams } = req.nextUrl;

    // 1️⃣ Force HTTPS in production
    if (
        process.env.NODE_ENV === "production" &&
        req.headers.get("x-forwarded-proto") !== "https"
    ) {
        return NextResponse.redirect(`https://${req.headers.get("host")}${req.nextUrl.pathname}`);
    }

    // 2️⃣ Basic request rate limiting
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const requests = ipStore.get(ip) || [];
    const recentRequests = requests.filter(ts => now - ts < RATE_LIMIT_WINDOW);

    recentRequests.push(now);
    ipStore.set(ip, recentRequests);

    if (recentRequests.length > RATE_LIMIT_MAX) {
        return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: { "Content-Type": "application/json" },
        });
    }

    // 3️⃣ Block suspicious patterns in URL
    const suspiciousPatterns = [
        /\.\./, // Directory traversal
        /<script>/i, // XSS attempt
        /union.*select/i, // SQL injection
        /%27|'/, // Unescaped quotes
    ];
    if (suspiciousPatterns.some((regex) => regex.test(pathname) || regex.test(searchParams.toString()))) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // 4️⃣ Dynamic protected paths
    // Matches: /profile, /checkout, /cart, /wishlist
    // AND /anyUserId/checkout, /anyUserId/cart, /anyUserId/wishlist
    const protectedPathPattern =
        /^\/(?:api\/secure|profile(?:\/.*)?|checkout(?:\/.*)?|cart(?:\/.*)?|wishlist(?:\/.*)?|[^/]+\/(?:checkout|cart|wishlist)(?:\/.*)?)$/;

    if (protectedPathPattern.test(pathname)) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            if (pathname.startsWith("/api")) {
                // Return 401 JSON for API requests
                return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                // Redirect for non-API routes
                const loginUrl = new URL("/authenticate?pageType=login", req.url);
                loginUrl.searchParams.set("callbackUrl", req.url);
                return NextResponse.redirect(loginUrl);
            }
        }
    }

    // 5️⃣ Add security headers
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    res.headers.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=(self)");

    res.headers.set(
        "Content-Security-Policy",
        `
    default-src 'self';
    img-src 'self' data: https://res.cloudinary.com;
    script-src 'self' 'unsafe-inline' https://checkout.razorpay.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.razorpay.com;
    frame-src https://checkout.razorpay.com https://api.razorpay.com;
  `.replace(/\s+/g, ' ').trim()
    );
    return res;
}

// Matcher — apply middleware globally
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
