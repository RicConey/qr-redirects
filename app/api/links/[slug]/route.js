import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, context) {
    const { params } = context;
    const slug = params.slug;

    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // ✅ используем правильное имя модели: QrLink → prisma.qrLink
        const link = await prisma.qrLink.findUnique({
            where: { slug },
            select: { owner_id: true },
        });

        if (!link) {
            return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
        }

        const isAdmin = session.user.role === "admin";
        const isOwner = session.user.id === link.owner_id;

        if (!isAdmin && !isOwner) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
        }

        await prisma.qrLink.delete({
            where: { slug },
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("DELETE error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
