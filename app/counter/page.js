import pool from '../../lib/db';
import "../../styles/common.css";

async function getStats() {
    const res = await pool.query(`
        SELECT l.slug, l.display_name, COUNT(*) AS clicks
        FROM qr_logs r
                 JOIN qr_links l ON l.slug = r.qr_slug
        GROUP BY l.slug, l.display_name
        ORDER BY l.slug ASC
    `);
    return res.rows;
}

export default async function CounterPage() {
    const stats = await getStats();
    return (
        <div className="container">
            <h1 className="header">Статистика переходов</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Slug</th>
                    <th>Display Name</th>
                    <th>Количество переходов</th>
                </tr>
                </thead>
                <tbody>
                {stats.map((stat) => (
                    <tr key={stat.slug}>
                        <td>
                            <a href={`/counter/${stat.slug}`}>{stat.slug}</a>
                        </td>
                        <td>{stat.display_name}</td>
                        <td>{stat.clicks}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
