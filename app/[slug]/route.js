// app/[slug]/route.js
import { NextResponse, notFound } from 'next/server';
import pool from '../../lib/db';
import { getMapping } from '../../lib/cache';

export async function GET(request, { params }) {
    // Дождёмся разрешения параметров
    const { slug } = await params;

    // Получаем маппинг slug → destination_url (с серверным кешированием)
    const mapping = await getMapping(pool);
    const targetUrl = mapping[slug];

    if (!targetUrl) {
        return notFound();
    }

    // Записываем редирект (лог клика) в базу
    await pool.query(
        "INSERT INTO qr_logs (qr_slug, click_timestamp) VALUES ($1, NOW())",
        [slug]
    );

    // Возвращаем редирект с заголовками для CDN‑кэширования:
    return NextResponse.redirect(targetUrl, {
        status: 307,
        headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600"
        }
    });
}
