"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import "../../styles/counter.css";
import { useRouter } from "next/navigation";


export default function CounterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            // Если пользователь не авторизован, сразу перенаправляем на главную
            window.location.href = "/";
        }
    }, [status]);

    if (status === "loading") {
        return <p>Загрузка...</p>;
    }

    // Если пользователь авторизован, показываем статистику
    return (
        <div className="counterContainer">
            <h1 className="counterHeader">Полная статистика переходов</h1>
            {/* Здесь ваш компонент статистики для админа */}
            {/* Например, список всех редиректов с данными */}
        </div>
    );
}
