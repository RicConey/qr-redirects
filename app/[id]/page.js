// app/[id]/page.js
import { redirect } from 'next/navigation';
import pool from '../../lib/db';

export default async function RedirectPage({ params }) {
    const { id } = params;
    const timestamp = new Date();

    try {
        // Логирование перехода в базу данных
        await pool.query(
            'INSERT INTO logs (qr_id, timestamp) VALUES ($1, $2)',
            [id, timestamp]
        );
    } catch (error) {
        console.error('Ошибка записи в БД:', error);
    }

    // Редирект на основной сайт
    redirect('https://kazantseva-rehabilitation.com.ua/');
}
