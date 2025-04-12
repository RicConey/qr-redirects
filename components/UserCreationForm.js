"use client";
import { useState } from "react";
import "../styles/common.css";
import "../styles/admin.css";

export default function UserCreationForm() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "user",
    });
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setMessage("Пользователь создан успешно!");
                setForm({ username: "", password: "", role: "user" });
            } else {
                const data = await res.json();
                setMessage("Ошибка при создании пользователя: " + (data.error || "Неизвестная ошибка"));
            }
        } catch (error) {
            console.error(error);
            setMessage("Ошибка при создании пользователя.");
        }
    }

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2 className="header" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Создать нового пользователя
            </h2>
            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-group">
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Роль:</label>
                    <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                    </select>
                </div>
                <button type="submit" className="action-button">
                    Создать пользователя
                </button>
            </form>
            {message && <p className="adminMessage">{message}</p>}
        </div>
    );
}
