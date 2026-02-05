const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
    const store = getStore("shop-data");
    const products = await store.get("products", { type: "json" }) || [];
    return { statusCode: 200, body: JSON.stringify(products) };
};