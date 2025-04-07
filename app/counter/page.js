// app/counter/page.js
import pool from '../../lib/db';

async function getLogs() {
    // Группируем по qr_id и считаем количество переходов
    const res = await pool.query(
        'SELECT qr_id, COUNT(*) AS clicks FROM qr_logs GROUP BY qr_id ORDER BY qr_id ASC'
    );
    return res.rows;
}

export default async function CounterPage() {
    const logs = await getLogs();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Статистика QR-кодов</h1>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                <tr>
                    <th>QR Код</th>
                    <th>Количество переходов</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((log) => (
                    <tr key={log.qr_id}>
                        <td>{log.qr_id}</td>
                        <td>{log.clicks}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
