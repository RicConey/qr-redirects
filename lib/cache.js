// lib/cache.js

let cachedMapping = null;

export async function getMapping(pool) {
    if (cachedMapping) {
        return cachedMapping;
    }
    const res = await pool.query('SELECT slug, destination_url FROM qr_links');
    cachedMapping = {};
    res.rows.forEach(row => {
        cachedMapping[row.slug] = row.destination_url;
    });
    return cachedMapping;
}

export function clearCache() {
    cachedMapping = null;
}
