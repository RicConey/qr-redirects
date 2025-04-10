// app/counter/[slug]/page.js
import pool from '../../../lib/db';
import "../../../styles/counter.css";

async function getLogDetails(slug) {
    // Выполним соединение таблиц, чтобы получить click_timestamp из qr_logs и display_name из qr_links
    const res = await pool.query(
        `
    SELECT r.click_timestamp, l.display_name
    FROM qr_logs r
    JOIN qr_links l ON l.slug = r.qr_slug
    WHERE r.qr_slug = $1
    ORDER BY r.click_timestamp DESC
    `,
        [slug]
    );
    return res.rows;
}

export default async function LogDetailPage({ params }) {
    // Дождемся, что params разрешится, чтобы корректно получить slug
    const { slug } = await params;
    const logs = await getLogDetails(slug);
    const displayName = logs.length > 0 ? logs[0].display_name : '';

    return (
        <div className="counterContainer">
            <h1 className="counterHeader">
                Детальная статистика для {displayName} ({slug})
            </h1>
            <table className="counterTable">
                <thead>
                <tr>
                    <th>Дата и время перехода</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((log, index) => (
                    <tr key={index}>
                        <td>{new Date(log.click_timestamp).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
