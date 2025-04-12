import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import pool from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }

    try {
        const res = await pool.query(`
            SELECT u.id, u.username, u.role,
                   COALESCE(
                           json_agg(
                                   json_build_object(
                                           'slug', q.slug,
                                           'destination_url', q.destination_url,
                                           'display_name', q.display_name
                                   )
                           ) FILTER (WHERE q.slug IS NOT NULL), '[]'
                   ) AS redirects
            FROM users u
                     LEFT JOIN qr_links q ON q.owner_id = u.id
            GROUP BY u.id, u.username, u.role
            ORDER BY u.id
        `);

        return new Response(JSON.stringify({ users: res.rows }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }

    try {
        const { username, password, role } = await req.json();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await pool.query(
            "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
            [username, password_hash, role || "user"]
        );

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
