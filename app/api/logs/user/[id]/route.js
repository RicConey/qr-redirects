import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, context) {
    const { params } = context;

    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
        return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = session.user.id === userId;
    if (!isAdmin && !isOwner) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    try {
        const stats = await prisma.$queryRaw`
            SELECT l.slug, l.display_name, COUNT(r.id)::int AS clicks
            FROM qr_logs r
                     JOIN qr_links l ON l.slug = r.qr_slug
            WHERE l.owner_id = ${userId}
            GROUP BY l.slug, l.display_name
            ORDER BY l.slug
        `;

        return new Response(JSON.stringify({ stats }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching logs for user:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
