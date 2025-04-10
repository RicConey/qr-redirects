// app/api/links/[slug]/route.js
import pool from '../../../../lib/db';
import { clearCache } from '../../../../lib/cache';

export async function PATCH(req, { params }) {
    try {
        const { slug } = await params;
        const { destination_url, display_name } = await req.json();
        await pool.query(
            "UPDATE qr_links SET destination_url = $1, display_name = $2 WHERE slug = $3",
            [destination_url, display_name, slug]
        );
        clearCache(); // Сброс кеша после обновления
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error updating link:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
