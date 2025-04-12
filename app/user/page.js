"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserPanel from "../../components/UserPanel";
import UserCounterStats from "@/components/UserCounterStats";
import "../../styles/common.css";
import "../../styles/admin.css";

export default function UserPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.replace("/auth/signin?error=unauthorized");
            return;
        }

        if (session && session.user.role !== "user") {
            setAccessDenied(true);
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <p>Завантаження...</p>;
    }

    if (accessDenied) {
        return (
            <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
                ⛔ У доступі відмовлено
            </p>
        );
    }

    return (
        <div className="adminStats">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="tableTitle">Мої редиректи</h1>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="action-button">
                    Вийти
                </button>
            </div>

            <UserPanel userId={session.user.id} />
            <UserCounterStats />
        </div>
    );
}
