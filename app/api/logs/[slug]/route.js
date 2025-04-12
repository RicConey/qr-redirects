// app/api/logs/[slug]/route.js

import { getServerSession } from "next-auth";          // Функция для проверки сессии
import { authOptions } from "../../auth/[...nextauth]/route"; // Экспортированный объект настроек NextAuth
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    // 1) Получаем текущую сессию пользователя
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2) Извлекаем slug из адреса (пример: /api/logs/abc123 => slug = "abc123")
    const slug = params.slug;

    try {
        // 3) Если у пользователя роль "admin", отдаем все логи данного slug
        if (session.user.role === "admin") {
            const logs = await prisma.qrLog.findMany({
                where: { qr_slug: slug },
                orderBy: { click_timestamp: "desc" },
            });
            return new Response(JSON.stringify({ logs }), { status: 200 });
        }

        // 4) Иначе (роль "user") проверяем, владеет ли он данной ссылкой
        const link = await prisma.qrLink.findUnique({
            where: { slug },
            select: { owner_id: true }, // Берем только поле owner_id
        });
        if (!link) {
            return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
        }
        if (link.owner_id !== session.user.id) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        // 5) Если владеет, возвращаем логи этого slug
        const logs = await prisma.qrLog.findMany({
            where: { qr_slug: slug },
            orderBy: { click_timestamp: "desc" },
        });
        return new Response(JSON.stringify({ logs }), { status: 200 });

    } catch (error) {
        // В случае любой ошибки возвращаем 500
        console.error("Error fetching logs:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(req, context) {
    const { params } = context;
    const slug = params.slug;

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const deleted = await prisma.qrLog.deleteMany({
            where: { qr_slug: slug },
        });

        return new Response(JSON.stringify({
            success: true,
            deletedCount: deleted.count
        }), { status: 200 });
    } catch (error) {
        console.error("Error deleting logs:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}