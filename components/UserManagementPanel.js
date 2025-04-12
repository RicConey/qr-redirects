"use client";
import { useEffect, useState } from "react";
import "../styles/common.css";
import "../styles/admin.css";

export default function UserManagementPanel() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState("");

    async function fetchUsers() {
        try {
            const res = await fetch("/api/users", { credentials: "include" });
            const data = await res.json();
            setUsers(Array.isArray(data.users) ? data.users : []);
        } catch (error) {
            console.error("Ошибка получения пользователей:", error);
            setMessage("Ошибка получения пользователей");
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        const role = form.role.value;
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password, role }),
        });
        if (res.ok) {
            setMessage("Пользователь создан успешно!");
            form.reset();
            fetchUsers();
        } else {
            const data = await res.json();
            setMessage("Ошибка при создании пользователя: " + (data.error || "Неизвестная ошибка"));
        }
    }

    async function handleEditSave(id, updatedData) {
        const res = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedData),
        });
        if (res.ok) {
            setMessage("Изменения сохранены.");
            setEditingUser(null);
            fetchUsers();
        } else {
            setMessage("Ошибка при обновлении пользователя.");
        }
    }

    async function handleDelete(id) {
        const res = await fetch(`/api/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) {
            setMessage("Пользователь удалён.");
            fetchUsers();
        } else {
            setMessage("Ошибка при удалении пользователя.");
        }
    }

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2 className="header" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Управление пользователями
            </h2>
            {message && <div className="adminMessage">{message}</div>}

            {/* Форма для создания нового пользователя */}
            <form onSubmit={handleCreate} className="form-card">
                <div className="form-group">
                    <label>Имя пользователя:</label>
                    <input type="text" name="username" required />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input type="password" name="password" required />
                </div>
                <div className="form-group">
                    <label>Роль:</label>
                    <select name="role">
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                    </select>
                </div>
                <button type="submit" className="action-button">
                    Создать пользователя
                </button>
            </form>

            {/* Таблица списка пользователей */}
            <table className="table responsive-table" style={{ marginTop: "1rem" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя пользователя</th>
                    <th>Роль</th>
                    <th>Редиректы</th>
                    <th>Пароль</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {(users || []).map((user) => {
                    const isEditing = editingUser && editingUser.id === user.id;
                    return (
                        <tr key={user.id}>
                            <td data-label="ID">{user.id}</td>
                            {isEditing ? (
                                <>
                                    <td data-label="Имя пользователя">
                                        <input
                                            type="text"
                                            defaultValue={user.username}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, username: e.target.value })
                                            }
                                        />
                                    </td>
                                    <td data-label="Роль">
                                        <select
                                            defaultValue={user.role}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, role: e.target.value })
                                            }
                                        >
                                            <option value="user">Пользователь</option>
                                            <option value="admin">Администратор</option>
                                        </select>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td data-label="Имя пользователя">{user.username}</td>
                                    <td data-label="Роль">{user.role}</td>
                                </>
                            )}
                            <td data-label="Редиректы">
                                {user.redirects && user.redirects.length > 0
                                    ? user.redirects.map((r) => r.slug).join(", ")
                                    : "-"}
                            </td>
                            {isEditing ? (
                                <td data-label="Пароль">
                                    <input
                                        type="password"
                                        placeholder="Новый пароль (оставьте пустым для без изменений)"
                                        value={editingUser.password || ""}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, password: e.target.value })
                                        }
                                    />
                                </td>
                            ) : (
                                <td data-label="Пароль">-</td>
                            )}
                            <td data-label="Действия">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleEditSave(user.id, {
                                                    username: editingUser.username,
                                                    role: editingUser.role,
                                                    password: editingUser.password,
                                                })
                                            }
                                            className="action-button"
                                            title="Сохранить"
                                        >
                                            <span>Сохранить</span>
                                        </button>
                                        <button
                                            onClick={() => setEditingUser(null)}
                                            className="action-button"
                                            title="Отмена"
                                        >
                                            <span>Отмена</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() =>
                                                setEditingUser({
                                                    id: user.id,
                                                    username: user.username,
                                                    role: user.role,
                                                    password: "",
                                                })
                                            }
                                            className="action-button"
                                            title="Редактировать"
                                        >
                                            <span>Редактировать</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="action-button"
                                            title="Удалить"
                                        >
                                            <span>Удалить</span>
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
