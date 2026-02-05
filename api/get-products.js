const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return res.status(500).json({ error: "Lỗi: Chưa cấu hình Database URL" });

    const sql = neon(connectionString);

    try {
        const { index, product, isDelete } = req.body;
        await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, data JSONB NOT NULL)`;
        const rows = await sql`SELECT id FROM products ORDER BY id ASC`;

        if (index !== null && (index < 0 || !rows[index])) {
            return res.status(400).json({ error: "Dữ liệu không đồng bộ. Vui lòng tải lại trang!" });
        }

        if (isDelete && index !== null) {
            await sql`DELETE FROM products WHERE id = ${rows[index].id}`;
        } else if (index !== null) {
            await sql`UPDATE products SET data = ${product} WHERE id = ${rows[index].id}`;
        } else {
            await sql`INSERT INTO products (data) VALUES (${product})`;
        }

        return res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi Database: " + error.message });
    }
};