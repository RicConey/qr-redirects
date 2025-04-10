// app/api/links/route.js
import pool from "../../../lib/db";

export async function GET(req) {
    const res = await pool.query("SELECT slug, destination_url, display_name FROM qr_links ORDER BY slug ASC");
    const links = res.rows;
    return new Response(JSON.stringify({ links }), {
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(req) {
    try {
        const { slug, destination_url, display_name } = await req.json();
        await pool.query(
            "INSERT INTO qr_links (slug, destination_url, display_name) VALUES ($1, $2, $3)",
            [slug, destination_url, display_name]
        );
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error adding link:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
