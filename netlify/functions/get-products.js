const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
    try {
        const store = getStore("shop-data");
        const products = await store.get("products", { type: "json" }) || [];

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(products)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};