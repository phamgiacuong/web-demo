const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    // Sử dụng biến môi trường NETLIFY_DATABASE_URL do Netlify tự tạo
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    try {
        const { index, product, isDelete } = JSON.parse(event.body);

        // Lấy danh sách ID hiện có để xác định đúng hàng cần thao tác
        const rows = await sql`SELECT id FROM products ORDER BY id ASC`;

        // TRƯỜNG HỢP XÓA
        if (isDelete && index !== null) {
            if (!rows[index]) throw new Error("Không tìm thấy sản phẩm để xóa");
            const targetId = rows[index].id;
            await sql`DELETE FROM products WHERE id = ${targetId}`;
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Xóa thành công" })
            };
        }

        // TRƯỜNG HỢP CHỈNH SỬA
        if (index !== null) {
            if (!rows[index]) throw new Error("Không tìm thấy sản phẩm để sửa");
            const targetId = rows[index].id;
            await sql`UPDATE products SET data = ${product} WHERE id = ${targetId}`;
        }
        // TRƯỜNG HỢP THÊM MỚI
        else {
            await sql`INSERT INTO products (data) VALUES (${product})`;
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Thao tác thành công" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message })
        };
    }
};