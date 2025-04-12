"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../../styles/admin.css";

export default function LogDetailPage() {
    const { data: session, status } = useSession();
    const { slug } = useParams();
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");

    // Защита: если не авторизован — редирект на главную
    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/";
        }
    }, [status]);

    useEffect(() => {
        if (status === "authenticated" && slug) {
            fetchLogs();
        }
    }, [status, slug]);

    async function fetchLogs() {
        try {
            const res = await fetch(`/api/logs/${slug}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Помилка запиту: ${res.status}. Відповідь: ${text}`);
            }
            const data = await res.json();
            setLogs(data.logs);
        } catch (error) {
            console.error("Помилка отримання логів:", error);
            setMessage("Помилка отримання логів: " + error.message);
        }
    }

    if (status === "loading") return <p>Завантаження...</p>;

    return (
        <div className="adminStats">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="tableTitle">Детальна статистика переходів</h2>
                <button
                    className="action-button"
                    onClick={() => window.history.back()}
                >
                    Назад
                </button>
            </div>

            <p><strong>Slug:</strong> {slug}</p>

            {message && <div className="adminMessage">{message}</div>}

            <table className="counterTable">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Дата переходу</th>
                </tr>
                </thead>
                <tbody>
                {logs.length === 0 ? (
                    <tr>
                        <td colSpan={2}>Переходів ще не було</td>
                    </tr>
                ) : (
                    logs.map((log, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {new Date(log.click_timestamp).toLocaleString("uk-UA", {
                                    timeZone: "Europe/Kiev",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                })}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
