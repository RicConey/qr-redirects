"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "../styles/admin.css";

export default function UserCounterStats() {
    const { data: session } = useSession();
    const [stats, setStats] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(`/api/logs/user/${session.user.id}`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Помилка запиту: ${res.status}. ${text}`);
                }
                const data = await res.json();
                setStats(Array.isArray(data.stats) ? data.stats : []);
            } catch (error) {
                console.error(error);
                setErrorMsg(error.message);
            }
        };
        fetchStats();
    }, [session]);

    return (
        <div className="adminStats" style={{ marginTop: "2rem" }}>
            <h2 className="tableTitle">Статистика моїх редиректів</h2>
            {errorMsg && <p className="adminMessage">{errorMsg}</p>}
            <table className="counterTable">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Назва</th>
                    <th>Slug</th>
                    <th>Переходи</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {stats.length === 0 ? (
                    <tr>
                        <td colSpan={5}>Переходів ще не було</td>
                    </tr>
                ) : (
                    stats.map((stat, index) => (
                        <tr key={stat.slug}>
                            <td>{index + 1}</td>
                            <td>{stat.display_name || "—"}</td>
                            <td>{stat.slug}</td>
                            <td>{stat.clicks}</td>
                            <td>
                                <a className="action-button" href={`/counter/${stat.slug}`}>
                                    Деталі
                                </a>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
