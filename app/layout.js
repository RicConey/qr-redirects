// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: 'NKZ - Новація Коротких З&#39;єднань',
    description: 'Новація Коротких З&#39;єднань',
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}
