"use client";
import { useEffect, useState } from "react";
import "../styles/common.css";
import "../styles/admin.css";

export default function UserPanel({ userId }) {
    const [links, setLinks] = useState([]);
    const [message, setMessage] = useState("");

    async function fetchLinks() {
        try {
            const res = await fetch("/api/links", { credentials: "include" });
            const data = await res.json();
            setLinks(Array.isArray(data.links) ? data.links : []);
        } catch (error) {
            console.error("Ошибка получения данных редиректов:", error);
            setMessage("Ошибка получения данных");
        }
    }

    useEffect(() => {
        fetchLinks();
    }, []);

    return (
        <div>
            {message && <div className="adminMessage">{message}</div>}
            <table className="table responsive-table">
                <thead>
                <tr>
                    <th>Slug</th>
                    <th>Destination URL</th>
                    <th>Display Name</th>
                </tr>
                </thead>
                <tbody>
                {(links || []).map((link) => (
                    <tr key={link.slug}>
                        <td data-label="Slug">{link.slug}</td>
                        <td data-label="Destination URL">{link.destination_url}</td>
                        <td data-label="Display Name">{link.display_name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
