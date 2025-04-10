// app/[slug]/route.js
import { NextResponse, notFound } from 'next/server';
import pool from '../../lib/db';
import { getMapping } from '../../lib/cache';

export async function GET(request, { params }) {
    const { slug } = await params;

    // Если это prefetch/pre-render запрос, пропустим логирование
    const purpose = request.headers.get('purpose') || '';
    const secPurpose = request.headers.get('sec-purpose') || '';

    // Если заголовок явно указывает на prefetch/prerender, пропускаем INSERT
    if (purpose === 'prefetch' || secPurpose.includes('prefetch')) {
        console.log('Skipping insert because it is a prefetch request.');
        // Получаем targetUrl (иначе notFound сломает префетч)
        const mapping = await getMapping(pool);
        const targetUrl = mapping[slug];
        if (!targetUrl) {
            return notFound();
        }
        return NextResponse.redirect(targetUrl, {
            status: 307,
            headers: {
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600"
            }
        });
    }

    // Обычный (настоящий) запрос - логируем
    const mapping = await getMapping(pool);
    const targetUrl = mapping[slug];
    if (!targetUrl) {
        return notFound();
    }

    await pool.query(
        "INSERT INTO qr_logs (qr_slug, click_timestamp) VALUES ($1, NOW())",
        [slug]
    );

    return NextResponse.redirect(targetUrl, {
        status: 307,
        headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600"
        }
    });
}
