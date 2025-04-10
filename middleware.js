// middleware.js
import { NextResponse } from 'next/server';

// Функция для асинхронного вычисления SHA-256 хэша строки, возвращает строку в шестнадцатеричном формате
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Преобразуем массив байт в шестнадцатеричную строку
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Защищаем маршруты админки и статистики
    if (pathname.startsWith('/admin') || pathname.startsWith('/counter')) {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return new NextResponse('Auth required', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            });
        }

        // Ожидаем схему Basic
        const [scheme, base64Credentials] = authHeader.split(' ');
        if (scheme !== 'Basic' || !base64Credentials) {
            return new NextResponse('Invalid authentication header', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            });
        }

        // Декодируем базовую строку (в Edge runtime доступна функция atob)
        const decoded = atob(base64Credentials);
        const [providedUsername, providedPassword] = decoded.split(':');

        if (!providedUsername || !providedPassword) {
            return new NextResponse('Invalid credentials', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            });
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // Проверяем имя пользователя
        if (providedUsername !== adminUsername) {
            return new NextResponse('Access Denied', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            });
        }

        // Вычисляем хэш предоставленного пароля
        const providedPasswordHash = await hashPassword(providedPassword);

        // Сравниваем хэши
        if (providedPasswordHash !== adminPasswordHash) {
            return new NextResponse('Access Denied', {
                status: 401,
                headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
            });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/counter/:path*'],
};
