// app/[slug]/page.js
import { redirect, notFound } from 'next/navigation';
import pool from '../../lib/db';
import qrMappings from '../../config';

export default async function RedirectPage({ params }) {
    // Явно ожидаем объект params
    const { slug } = await Promise.resolve(params);

    const targetUrl = qrMappings[slug];
    if (!targetUrl) {
        notFound();
    }

    const now = new Date().toISOString();
    const currentDate = now.split('T')[0];
    const currentTime = now.split('T')[1].split('.')[0];

    try {
        await pool.query(
            'INSERT INTO qr_logs (qr_id, date, time) VALUES ($1, $2, $3)',
            [slug, currentDate, currentTime]
        );
    } catch (error) {
        console.error('Ошибка записи в БД:', error);
    }

    redirect(targetUrl);
}
