const { neon } = require("@neondatabase/serverless");

module.exports = async (req, res) => {
    // ===== CORS =====
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return res.status(500).json({ error: "Missing DATABASE_URL" });
    }

    const sql = neon(connectionString);

    try {
        const { id, product, action } = req.body;

        if (!action || !["create", "update", "delete"].includes(action)) {
            return res.status(400).json({ error: "Invalid action" });
        }

        await sql`
            CREATE TABLE IF NOT EXISTS products (
                                                    id SERIAL PRIMARY KEY,
                                                    data JSONB NOT NULL
            )
        `;

        // ===== DELETE =====
        if (action === "delete") {
            if (!id) {
                return res.status(400).json({ error: "Missing product id" });
            }

            await sql`DELETE FROM products WHERE id = ${id}`;
            return res.status(200).json({ message: "Deleted", id });
        }

        // ===== VALIDATE PRODUCT =====
        if (!product || !product.name) {
            return res.status(400).json({ error: "Invalid product data" });
        }

        const normalizedProduct = {
            name: product.name || "",
            price: product.price || 0,
            category: product.category || "Khác",
            desc: product.desc || "",
            images: Array.isArray(product.images) ? product.images : []
        };

        // ===== UPDATE =====
        if (action === "update") {
            if (!id) {
                return res.status(400).json({ error: "Missing product id" });
            }

            await sql`
        UPDATE products
        SET data = ${normalizedProduct}
        WHERE id = ${id}
      `;

            return res.status(200).json({
                message: "Updated",
                id,
                product: normalizedProduct
            });
        }

        // ===== CREATE =====
        const rows = await sql`
      INSERT INTO products (data)
      VALUES (${normalizedProduct})
      RETURNING id
    `;

        return res.status(201).json({
            message: "Created",
            id: rows[0].id,
            product: normalizedProduct
        });

    } catch (err) {
        console.error("❌ save-product error:", err);
        return res.status(500).json({ error: err.message });
    }
};