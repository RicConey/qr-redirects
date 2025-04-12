"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import "../styles/admin.css";


export default function AdminCounterStats() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/admin-stats")
            .then((res) => res.json())
            .then((data) => {
                if (data.stats) setStats(data.stats);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching stats:", err);
                setLoading(false);
            });
    }, [status]);

    if (status === "loading" || loading) return <p>Завантаження...</p>;

    return (
        <div className="adminStats">
            <h2 className="tableTitle">Загальна статистика переходів</h2>
            <table className="counterTable">
                <thead>
                <tr>
                    <th>Slug</th>
                    <th>Display Name</th>
                    <th>Кількість переходів</th>
                    <th>Власник</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {stats.map((stat) => (
                    <tr key={stat.slug}>
                        <td>{stat.slug}</td>
                        <td>{stat.display_name || "—"}</td>
                        <td>{stat.clicks}</td>
                        <td>{stat.owner_username || "—"}</td>
                        <td>
                            <div className="action-buttons">
                                <a className="action-button" href={`/counter/${stat.slug}`}>
                                    Деталі
                                </a>
                                <button
                                    className="action-button danger"
                                    onClick={() => {
                                        if (confirm(`Очистити всі логи для "${stat.slug}"?`)) {
                                            fetch(`/api/logs/${stat.slug}`, {
                                                method: "DELETE",
                                            })
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    if (data.success) {
                                                        alert(`Видалено ${data.deletedCount} логів`);
                                                        window.location.reload();
                                                    } else {
                                                        alert("Помилка при видаленні");
                                                    }
                                                });
                                        }
                                    }}
                                >
                                    Очистити
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
