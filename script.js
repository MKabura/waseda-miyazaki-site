let observer;

document.addEventListener('DOMContentLoaded', () => {

    /* ============================
       共通：メニュー・アニメーション
    ============================ */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileBtn && mobileNav) {
        const spans = mobileBtn.querySelectorAll('span');
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer
    const observerOptions = { threshold: 0.1, rootMargin: "0px" };
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.news-card, .event-item, .contact-method, .section-header');
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    /* ============================
       ページ判定
    ============================ */
    const path = window.location.pathname;

    if (path.endsWith("/") || path.includes("index.html") || path.includes("waseda-miyazaki-site")) {
    loadIndex();
    } else if (path.includes("category.html")) {
        loadCategory();
    } else if (path.includes("news.html")) {
        loadArticle();
    }
});


/* ============================
   1. トップページ（新着一覧）
============================ */
async function loadIndex() {
    const endpoint = "https://script.google.com/macros/s/AKfycbytKfUXDJbkKFs-9eIgJ46c0dxPkuJEI1pRkJUjTVzH8FwqHolZjJCKKnnj6F-JSLwoWw/exec";
    const res = await fetch(endpoint);
    const items = await res.json();
    renderNews(items);
}

function renderNews(items) {
    const container = document.getElementById("news-list");
    container.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "news-card";

        const imageSrc = item.image ? `./images/${item.image}` : './images/logo.jpg';

        card.innerHTML = `
            <img src="${imageSrc}" alt="" onerror="if (this.src !== 'images/logo.jpg') this.src = 'images/logo.jpg';">
            <h3>${item.title || 'タイトルなし'}</h3>
            <p class="date">${item.date || ''}</p>
            <p>${item.summary || ''}</p>
            <a href="${item.url || '#'}" class="more">続きを読む</a>
        `;

        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        container.appendChild(card);

        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    });
}


/* ============================
   2. カテゴリページ
============================ */
async function loadCategory() {
    const endpoint = "https://script.google.com/macros/s/AKfycbytKfUXDJbkKFs-9eIgJ46c0dxPkuJEI1pRkJUjTVzH8FwqHolZjJCKKnnj6F-JSLwoWw/exec";

    const params = new URLSearchParams(window.location.search);
    const category = params.get("cat");

    document.getElementById("category-title").textContent = category;

    const res = await fetch(endpoint);
    const items = await res.json();

    const filtered = items.filter(item => item.category === category);

    const container = document.getElementById("category-list");
    container.innerHTML = "";

    filtered.forEach(item => {
        const imageSrc = item.image ? `./images/${item.image}` : './images/logo.jpg';

        container.innerHTML += `
            <div class="news-card">
                <img src="${imageSrc}" alt="">
                <h3>${item.title}</h3>
                <p class="date">${item.date}</p>
                <p>${item.summary}</p>
                <a href="${item.url}" class="more">続きを読む</a>
            </div>
        `;
    });
}


/* ============================
   3. 記事ページ（news.html）
============================ */
async function loadArticle() {
    const endpoint = "https://script.google.com/macros/s/AKfycbytKfUXDJbkKFs-9eIgJ46c0dxPkuJEI1pRkJUjTVzH8FwqHolZjJCKKnnj6F-JSLwoWw/exec";

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(endpoint);
    const items = await res.json();

    const item = items.find(i => i.id === id);
    if (!item) return;

    document.getElementById("news-title").textContent = item.title;
    document.getElementById("news-date").textContent = item.date;
    document.getElementById("news-image").src = `./images/${item.image}`;
    document.getElementById("news-content").innerHTML = item.body;
}



// loadNews();
