const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return res.status(500).json({ error: "Missing DATABASE_URL" });
    }

    const sql = neon(connectionString);

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                                                    id SERIAL PRIMARY KEY,
                                                    data JSONB NOT NULL
            )
        `;

        const rows = await sql`
            SELECT id, data
            FROM products
            ORDER BY id DESC
        `;

        const products = rows.map(r => ({
            id: r.id,
            name: r.data.name || "",
            price: r.data.price || 0,
            category: r.data.category || "Khác",
            desc: r.data.desc || "",
            images: Array.isArray(r.data.images)
                ? r.data.images
                : []
        }));

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        res.status(200).json(products);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};