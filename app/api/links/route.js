import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import pool from "../../../lib/db";

// GET: Возвращаем либо все ссылки (для admin), либо ссылки текущего пользователя (для user)
export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }

    try {
        if (session.user.role === "admin") {
            // Админ видит все ссылки
            const { rows } = await pool.query("SELECT * FROM qr_links ORDER BY slug ASC");
            return new Response(JSON.stringify({ links: rows }), { status: 200 });
        } else {
            // Обычный user видит только свои ссылки
            const { rows } = await pool.query(
                "SELECT * FROM qr_links WHERE owner_id = $1 ORDER BY slug ASC",
                [session.user.id]
            );
            return new Response(JSON.stringify({ links: rows }), { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching links:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// POST: Создаем новую ссылку (можно настроить логику разрешений по вашим требованиям)
export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }

    try {
        const { slug, destination_url, display_name, owner_id } = await req.json();

        // Если хотите, чтобы user мог создавать только для себя, проверяем:
        // if (session.user.role === "user") { ... }
        // if (session.user.role === "admin") { ... }

        // Здесь для простоты разрешим только админу создавать ссылки
        if (session.user.role !== "admin") {
            return new Response(JSON.stringify({ error: "Only admin can create links" }), { status: 403 });
        }

        await pool.query(
            `INSERT INTO qr_links (slug, destination_url, display_name, owner_id)
       VALUES ($1, $2, $3, $4)`,
            [slug, destination_url, display_name, owner_id || null]
        );

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error creating link:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
