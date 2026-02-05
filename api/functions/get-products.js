const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    const sql = neon(process.env.DATABASE_URL); // Tên biến môi trường trên Vercel
    try {
        const rows = await sql`SELECT data FROM products ORDER BY id ASC`;
        const products = rows.map(r => r.data);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};