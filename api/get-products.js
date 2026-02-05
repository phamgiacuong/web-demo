const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    // Cho phép GET để lấy dữ liệu, POST để tạo bảng nếu cần
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return res.status(500).json({ error: "Missing DATABASE_URL" });

    const sql = neon(connectionString);
    try {
        // Tự động tạo bảng nếu chưa có
        await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, data JSONB NOT NULL)`;

        const rows = await sql`SELECT data FROM products ORDER BY id ASC`;
        const products = rows.map(r => r.data);

        // Cấu hình Header để tránh lỗi chặn truy cập (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};