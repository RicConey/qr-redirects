import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Экспортируем объект настроек, чтобы импортировать его в других файлах (authOptions)
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Имя пользователя", type: "text" },
                password: { label: "Пароль", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const { username, password } = credentials;

                try {
                    // Ищем пользователя в таблице users (где поле называется "password_hash")
                    const user = await prisma.user.findUnique({
                        where: { username },
                    });
                    if (!user) {
                        // Пользователь не найден
                        return null;
                    }

                    // Сравниваем введённый пароль с хэшом, хранящимся в user.password_hash
                    const isValid = await bcrypt.compare(password, user.password_hash);
                    if (!isValid) {
                        // Пароль неверный
                        return null;
                    }

                    // Возвращаем объект пользователя (без password_hash)
                    return {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Ошибка в authorize:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // Сохраняем данные в JWT после авторизации
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        // Передаём данные из JWT в session, чтобы клиент мог их использовать
        async session({ session, token }) {
            session.user = {
                id: token.id,
                username: token.username,
                role: token.role,
            };
            return session;
        },
        // Редирект: возвращаем baseUrl (редиректим на главную)
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin", // страница входа
    },
};

// Создаём handler на базе настроек
const handler = NextAuth(authOptions);

// Экспортируем handler под GET/POST
export { handler as GET, handler as POST };
