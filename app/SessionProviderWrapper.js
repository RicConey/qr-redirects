// app/SessionProviderWrapper.js
"use client"; // Это клиентский компонент
import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children, session }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
