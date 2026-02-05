const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

    if (!connectionString) {
        return res.status(500).json({ error: "Missing DATABASE_URL" });
    }

    const sql = neon(connectionString);
    try {
        // TỰ ĐỘNG TẠO BẢNG NẾU CHƯA CÓ
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL
            )
        `;

        const rows = await sql`SELECT data FROM products ORDER BY id ASC`;
        const products = rows.map(r => r.data);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};