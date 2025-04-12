import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import pool from "../../../lib/db";

export async function GET(req) {
    // Проверяем сессию
    const session = await getServerSession(authOptions);
    // Если нет сессии или пользователь не admin → 401
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }

    // Получаем статистику из таблиц qr_logs, qr_links, users
    try {
        const res = await pool.query(`
            SELECT l.slug, l.display_name, COUNT(*) AS clicks, u.username AS owner_username
            FROM qr_logs r
                     JOIN qr_links l ON l.slug = r.qr_slug
                     LEFT JOIN users u ON l.owner_id = u.id
            GROUP BY l.slug, l.display_name, u.username
            ORDER BY l.slug ASC
        `);

        return new Response(JSON.stringify({ stats: res.rows }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
