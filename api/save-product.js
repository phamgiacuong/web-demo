const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    const sql = neon(connectionString);

    try {
        const { index, product, isDelete } = req.body;

        // Đảm bảo bảng tồn tại trước khi thao tác
        await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, data JSONB NOT NULL)`;

        const rows = await sql`SELECT id FROM products ORDER BY id ASC`;

        if (isDelete && index !== null) {
            await sql`DELETE FROM products WHERE id = ${rows[index].id}`;
        } else if (index !== null) {
            await sql`UPDATE products SET data = ${product} WHERE id = ${rows[index].id}`;
        } else {
            await sql`INSERT INTO products (data) VALUES (${product})`;
        }

        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};