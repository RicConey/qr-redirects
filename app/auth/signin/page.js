'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Если пользователь попал на страницу с ошибкой авторизации (например, через middleware)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("error") === "unauthorized") {
            setError("⛔ Спочатку увійдіть у систему");
        }
    }, []);

    // Редирект после успешного входа в систему по роли
    useEffect(() => {
        if (status === "authenticated") {
            const role = session?.user?.role;
            if (role === "admin") {
                router.replace("/admin");
            } else if (role === "user") {
                router.replace("/user");
            } else {
                router.replace("/");
            }
        }
    }, [status, session, router]);

    // Функция валидации – допускаются только латинские буквы, цифры и символы _ . -
    const validateInput = (text) => /^[a-zA-Z0-9_.-]{1,32}$/.test(text);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInput(username) || !validateInput(password)) {
            setError("Недопустимі символи в імені або паролі");
            return;
        }

        setLoading(true);
        setError("");

        // Имитация задержки (1 секунда) для улучшения UX
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (res?.error) {
            setError("Невірне ім’я або пароль");
        }
        setLoading(false);
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "40px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Вхід до системи
            </h2>
            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
                <input
                    type="text"
                    name="username"
                    placeholder="Ім’я користувача"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: "10px", fontWeight: "bold", cursor: "pointer" }}
                >
                    {loading ? "Зачекайте..." : "Увійти"}
                </button>
                {error && (
                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                )}
            </form>
        </div>
    );
}

const inputStyle = {
    padding: "10px",
    border: "2px solid #3B82F6",
    borderRadius: "6px",
    outline: "none",
    fontSize: "16px",
    width: "100%",
};
