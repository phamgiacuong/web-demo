const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { index, product } = JSON.parse(event.body);
        const store = getStore("shop-data");

        let products = await store.get("products", { type: "json" }) || [];

        if (index !== null && index >= 0) {
            products[index] = product;
        } else {
            products.push(product);
        }

        await store.setJSON("products", products);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Success", data: products })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};