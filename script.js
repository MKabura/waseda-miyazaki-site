let observer; 
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileBtn && mobileNav) {
        const spans = mobileBtn.querySelectorAll('span');
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            
            // Animate hamburger
            // const spans = mobileBtn.querySelectorAll('span');
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

        // Close menu when clicking a link
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

    // Smooth Scroll for Anchor links (optional polish, reliable event delegation)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations (fade in elements)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };
    
    observer = new IntersectionObserver((entries) => {
    // const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatableElements = document.querySelectorAll('.news-card, .event-item, .contact-method, .section-header');
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Custom visible class logic since we added inline styles above
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
    loadNews();
});

// =====  新着記事取得(data/news.json) =====
async function loadNews() {
    const endpoint = "https://script.google.com/macros/s/AKfycbyUcTaFeinmyI69fZuMLDWs-NARzO70uy-j-LSoutlakfGI9SgWkS5Tm62fjQQ68ELE_A/exec";
    const res = await fetch(endpoint);
    const data = await res.json();
    renderNews(data);
    // renderNews(data.contents);
}

function renderNews(items) {
    const container = document.getElementById("news-list");
    container.innerHTML = ""; // 初期化

    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "news-card";

        // 画像が空、または存在しない場合の判定
        const imageSrc = item.image ? `images/${item.image}` : 'images/logo.jpg';

        card.innerHTML = `
            <img src="${imageSrc}" alt="" onerror="if (this.src !== 'images/logo.jpg') this.src = 'images/logo.jpg';">
            <h3>${item.title || 'タイトルなし'}</h3>
            <p class="date">${item.date || ''}</p>
            <p>${item.summary || ''}</p>
            <a href="${item.url || '#'}" class="more">続きを読む</a>
        `;

        // 初期状態（非表示）
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        container.appendChild(card);

        // 次のフレームでアニメーション開始
        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    });
}


// loadNews();