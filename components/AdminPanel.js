"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import "../styles/common.css";
import "../styles/admin.css";

export default function AdminPanel() {
    const [links, setLinks] = useState([]);
    const [form, setForm] = useState({
        slug: "",
        destination_url: "",
        display_name: "",
        owner_id: "",
    });
    const [message, setMessage] = useState("");
    const [editingLink, setEditingLink] = useState(null);

    async function fetchLinks() {
        try {
            const res = await fetch("/api/links", { credentials: "include" });
            const data = await res.json();
            setLinks(Array.isArray(data.links) ? data.links : []);
        } catch (error) {
            console.error("Ошибка получения ссылок:", error);
            setMessage("Ошибка получения ссылок");
        }
    }

    useEffect(() => {
        fetchLinks();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("/api/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setMessage("Ссылка добавлена успешно!");
            setForm({ slug: "", destination_url: "", display_name: "", owner_id: "" });
            fetchLinks();
        } else {
            setMessage("Ошибка при добавлении ссылки.");
        }
    }

    async function handleDelete(slug) {
        const res = await fetch("/api/links/" + slug, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) {
            setMessage("Ссылка удалена.");
            fetchLinks();
        } else {
            setMessage("Ошибка при удалении ссылки.");
        }
    }

    async function handleEditSave() {
        const res = await fetch("/api/links/" + editingLink.slug, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                destination_url: editingLink.destination_url,
                display_name: editingLink.display_name,
                owner_id: editingLink.owner_id,
            }),
        });
        if (res.ok) {
            setMessage("Изменения сохранены.");
            setEditingLink(null);
            fetchLinks();
        } else {
            setMessage("Ошибка при обновлении ссылки.");
        }
    }

    return (
        <div className="container">
            <h1 className="header">Админка для управления ссылками</h1>
            {message && <div className="adminMessage">{message}</div>}

            {/* Форма для создания новой ссылки */}
            <div className="form-card">
                <h2 className="header" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    Добавить новую ссылку
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Slug:</label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Destination URL:</label>
                        <input
                            type="url"
                            value={form.destination_url}
                            onChange={(e) => setForm({ ...form, destination_url: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Display Name:</label>
                        <input
                            type="text"
                            value={form.display_name}
                            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Владелец (ID):</label>
                        <input
                            type="text"
                            placeholder="ID владельца"
                            value={form.owner_id}
                            onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="action-button">
                        Добавить ссылку
                    </button>
                </form>
            </div>

            {/* Таблица существующих ссылок */}
            <div className="form-card">
                <h2 className="header" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    Существующие ссылки
                </h2>
                <table className="table responsive-table">
                    <thead>
                    <tr>
                        <th>Slug</th>
                        <th>Destination URL</th>
                        <th>Display Name</th>
                        <th>Владелец (ID)</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(links || []).map((link) => {
                        const isEditing = editingLink && editingLink.slug === link.slug;
                        return (
                            <tr key={link.slug} className={isEditing ? "editing-row" : ""}>
                                <td data-label="Slug">{link.slug}</td>
                                {isEditing ? (
                                    <>
                                        <td data-label="Destination URL">
                                            <input
                                                type="url"
                                                value={editingLink.destination_url}
                                                onChange={(e) =>
                                                    setEditingLink({
                                                        ...editingLink,
                                                        destination_url: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </td>
                                        <td data-label="Display Name">
                                            <input
                                                type="text"
                                                value={editingLink.display_name}
                                                onChange={(e) =>
                                                    setEditingLink({
                                                        ...editingLink,
                                                        display_name: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td data-label="Владелец (ID)">
                                            <input
                                                type="text"
                                                value={editingLink.owner_id || ""}
                                                onChange={(e) =>
                                                    setEditingLink({
                                                        ...editingLink,
                                                        owner_id: e.target.value,
                                                    })
                                                }
                                            />
                                        </td>
                                        <td data-label="Действия">
                                            <button onClick={handleEditSave} className="action-button" title="Сохранить">
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => setEditingLink(null)}
                                                className="action-button"
                                                title="Отмена"
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td data-label="Destination URL">{link.destination_url}</td>
                                        <td data-label="Display Name">{link.display_name}</td>
                                        <td data-label="Владелец (ID)">{link.owner_id || "-"}</td>
                                        <td data-label="Действия">
                                            <button
                                                onClick={() =>
                                                    setEditingLink({
                                                        slug: link.slug,
                                                        destination_url: link.destination_url,
                                                        display_name: link.display_name,
                                                        owner_id: link.owner_id,
                                                    })
                                                }
                                                className="action-button"
                                                title="Редактировать"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(link.slug)}
                                                className="action-button"
                                                title="Удалить"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
