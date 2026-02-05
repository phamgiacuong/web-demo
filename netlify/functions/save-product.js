const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon();
    try {
        const { index, product } = JSON.parse(event.body);

        if (index !== null) {
            // Cập nhật sản phẩm dựa trên ID (ở đây dùng logic đơn giản là lấy ID theo thứ tự)
            const rows = await sql`SELECT id FROM products ORDER BY id ASC`;
            const targetId = rows[index].id;
            await sql`UPDATE products SET data = ${product} WHERE id = ${targetId}`;
        } else {
            // Thêm mới
            await sql`INSERT INTO products (data) VALUES (${product})`;
        }

        return { statusCode: 200, body: "Success" };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};