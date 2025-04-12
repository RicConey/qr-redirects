// app/api/users/[id]/route.js
import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }
    try {
        const { id } = await params;
        const { username, password, role } = await req.json();

        if (password) {
            // Если пароль передан, обновляем его
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            await pool.query(
                "UPDATE users SET username = $1, password_hash = $2, role = $3 WHERE id = $4",
                [username, password_hash, role, id]
            );
        } else {
            await pool.query(
                "UPDATE users SET username = $1, role = $2 WHERE id = $3",
                [username, role, id]
            );
        }
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Access Denied" }), { status: 401 });
    }
    try {
        const { id } = await params;
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
