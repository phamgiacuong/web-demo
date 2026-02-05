/* ================= CONFIG ================= */
const API_URL = "/api/get-products"

let products = []
let filteredProducts = []

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
    try {
        const res = await fetch(API_URL)
        const data = await res.json()

        /**
         * Giả định get-products.js trả về:
         * [
         *  {
         *    name,
         *    price,
         *    category,
         *    desc,
         *    images: []
         *  }
         * ]
         */

        products = data.map(p => ({
            name: p.name,
            price: formatPrice(p.price),
            category: p.category || "Khác",
            desc: p.desc || "",
            images: p.images && p.images.length
                ? p.images
                : ["/no-image.png"]
        }))

        filteredProducts = [...products]
        renderProducts()

    } catch (err) {
        console.error("❌ Không load được sản phẩm", err)
    }
}

/* ================= RENDER GRID ================= */
function renderProducts() {
    const list = document.getElementById("productList")
    list.innerHTML = ""

    filteredProducts.forEach((p, index) => {
        list.innerHTML += `
      <div class="product-card" onclick="openProduct(${index})">
        <div class="product-img">
          <img src="${p.images[0]}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price">${p.price}</div>
        </div>
      </div>
    `
    })
}

/* ================= MODAL ================= */
function openProduct(index) {
    const p = filteredProducts[index]

    document.getElementById("modalMainImg").src = p.images[0]
    document.getElementById("modalName").innerText = p.name
    document.getElementById("modalPrice").innerText = p.price
    document.getElementById("modalDesc").innerText = p.desc

    const thumbs = document.getElementById("modalThumbnails")
    thumbs.innerHTML = ""
    p.images.forEach(img => {
        thumbs.innerHTML += `
      <img src="${img}" onclick="setMainImage('${img}')">
    `
    })

    document.getElementById("productModal").classList.remove("hidden")
}

function setMainImage(src) {
    document.getElementById("modalMainImg").src = src
}

function closeProductModal() {
    document.getElementById("productModal").classList.add("hidden")
}

/* ================= SEARCH ================= */
function handleSearch(e) {
    const value = e.target.value.toLowerCase()
    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(value)
    )
    renderProducts()
}

/* ================= CATEGORY ================= */
function filterByCategory(cat, el) {
    document.querySelectorAll(".cat")
        .forEach(b => b.classList.remove("active"))
    el.classList.add("active")

    filteredProducts =
        cat === "Tất cả"
            ? products
            : products.filter(p => p.category === cat)

    renderProducts()
}

/* ================= UTIL ================= */
function formatPrice(v) {
    if (!v) return ""
    if (typeof v === "string") return v
    return v.toLocaleString("vi-VN") + "đ"
}

/* ================= INIT ================= */
loadProducts()