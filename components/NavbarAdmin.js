"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NavbarAdmin() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "📊 Статистика" },
        { href: "/admin/links", label: "🔗 Ссилки" },
        { href: "/admin/users", label: "👥 Користувачі" },
    ];

    return (
        <nav className="admin-nav" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <div className="admin-nav-left" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={pathname === href ? "active" : ""}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            <button
                className="action-button"
                onClick={() => signOut({ callbackUrl: "/" })}
            >
                Вийти
            </button>
        </nav>
    );
}
