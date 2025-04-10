// app/[slug]/page.js
import { redirect, notFound } from 'next/navigation';
import pool from '../../lib/db';
import { getMapping } from '../../lib/cache';

export default async function RedirectPage({ params }) {
    // Дожидаемся, что params разрешатся, и извлекаем slug
    const { slug } = await params;

    // Получаем маппинг slug → destination_url (используя серверное кеширование)
    const mapping = await getMapping(pool);
    const targetUrl = mapping[slug];

    // Если для данного slug нет URL назначения, возвращаем 404
    if (!targetUrl) {
        notFound();
    }

    // Регистрируем редирект: записываем данные о клике в таблицу логов
    await pool.query(
        "INSERT INTO qr_logs (qr_slug, click_timestamp) VALUES ($1, NOW())",
        [slug]
    );

    // Выполняем редирект с заголовком Cache-Control для CDN-кэширования
    return redirect(targetUrl, {
        status: 307,
        headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600"
        }
    });
}
