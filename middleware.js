import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Разрешаем публичные маршруты, statics, /auth, /api
    if (
        pathname.startsWith("/auth") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Если нужно, чтобы /counter/... только для авторизованных:
    if (pathname.startsWith("/counter")) {
        // Неавторизован → перенаправляем на логин
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth/signin";
            url.search = "?error=unauthorized";
            return NextResponse.redirect(url);
        }
    }

    // Если нужно проверить, что /admin только для admin, /user для user — оставляем
    if (pathname.startsWith("/admin") && (!token || token.role !== "admin")) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/signin";
        url.search = "?error=unauthorized";
        return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/user") && (!token || token.role !== "user")) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/signin";
        url.search = "?error=unauthorized";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Включаем middleware для /admin, /user, /counter
export const config = {
    matcher: ["/admin/:path*", "/user/:path*", "/counter/:path*"],
};
