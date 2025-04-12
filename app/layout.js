// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: 'NKZ - Новація Коротких З`єднань',
    description: 'Новація Коротких З`єднань',
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
            {children}
        </SessionProviderWrapper>
        </body>
        </html>
    );
}
