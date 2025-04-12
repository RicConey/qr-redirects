"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminPanel from "../../../components/AdminPanel";
import NavbarAdmin from "../../../components/NavbarAdmin";

export default function LinksPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.replace("/auth/signin?error=unauthorized");
            return;
        }
        if (session && session.user.role !== "admin") {
            setAccessDenied(true);
        }
    }, [status, session, router]);

    if (status === "loading") return <p>Загрузка...</p>;
    if (accessDenied) return <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>⛔ У доступі відмовлено</p>;

    return (
        <div className="container">
            <NavbarAdmin />
            <AdminPanel />
        </div>
    );
}
