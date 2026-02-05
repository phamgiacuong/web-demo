const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
    const { index, product } = JSON.parse(event.body);
    const store = getStore("shop-data");
    let products = await store.get("products", { type: "json" }) || [];

    if (index !== null) products[index] = product;
    else products.push(product);

    await store.setJSON("products", products);
    return { statusCode: 200, body: "Success" };
};