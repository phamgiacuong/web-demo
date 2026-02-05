const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
    const sql = neon(process.env.DATABASE_URL);
    try {
        // Tự động tạo bảng nếu chưa có
        await sql`CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL
        )`;

        const rows = await sql`SELECT data FROM products ORDER BY id ASC`;
        const products = rows.map(r => r.data);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(products)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};