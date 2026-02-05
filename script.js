/* ===== DEMO DATA ===== */
const product = {
    name: "Combo Cô Đơn",
    price: 289000,
    desc: "Bao gồm: 01 hũ cá hồi ngâm tương 100gr, 01 hũ tôm ngâm, ăn liền – chuẩn vị Hàn Quốc.",
    images: [
        "https://picsum.photos/600?1",
        "https://picsum.photos/600?2",
        "https://picsum.photos/600?3"
    ]
};

const modalMainImg = document.getElementById('modalMainImg');
const modalThumbnails = document.getElementById('modalThumbnails');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');

/* ===== INIT ===== */
function preloadImages(images) {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function initProduct() {
    preloadImages(product.images);

    setTimeout(() => {
        modalName.innerText = product.name;
        modalPrice.innerText =
            new Intl.NumberFormat('vi-VN').format(product.price) + 'đ';
        modalDesc.innerText = product.desc;

        modalMainImg.src = product.images[0];

        modalThumbnails.innerHTML = product.images.map((src, i) => `
      <img src="${src}" class="${i === 0 ? 'active' : ''}"
        onclick="selectThumb(${i})">
    `).join('');

        document.querySelectorAll('.skeleton, .skeleton-text')
            .forEach(el => el.classList.remove('skeleton'));
    }, 400);
}

/* ===== THUMB SELECT ===== */
function selectThumb(i) {
    modalMainImg.src = product.images[i];
    document.querySelectorAll('.sp-thumbs img')
        .forEach((img, idx) =>
            img.classList.toggle('active', idx === i)
        );
}

/* ===== ZOOM FOLLOW CURSOR ===== */
const spMain = document.querySelector('.sp-main');

spMain.addEventListener('mousemove', (e) => {
    const rect = spMain.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    modalMainImg.style.transformOrigin = `${x}% ${y}%`;
    modalMainImg.style.transform = 'scale(1.8)';
});

spMain.addEventListener('mouseleave', () => {
    modalMainImg.style.transform = 'scale(1)';
    modalMainImg.style.transformOrigin = 'center';
});

/* ===== CTA CLICK FEEDBACK ===== */
document.querySelectorAll('.sp-cta, .sticky-cta button')