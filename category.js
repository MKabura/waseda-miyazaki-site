function loadCategory() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("cat");

    document.getElementById("category-title").textContent = category;

    const callbackName = "handleData";

    window[callbackName] = function(items) {
        const filtered = items.filter(item => item.category === category);

        const container = document.getElementById("category-list");
        container.innerHTML = "";

        filtered.forEach(item => { 
            // 画像が空、または存在しない場合の判定
            const imageSrc = item.image ? `images/${item.image}` : 'images/logo.jpg';
            container.innerHTML += `
                <div class="news-card">
                    <img src="${imageSrc}" alt="" onerror="if (this.src !== 'images/logo.jpg') this.src = 'images/logo.jpg';">
                    <h3>${item.title}</h3>
                    <p class="date">${item.date}</p>
                    <p>${item.summary}</p>
                    <a href="news.html?id=${item.id}" class="more">続きを読む</a>
                </div>
            `;
        });
    };

    const script = document.createElement("script");
    script.src = `https://script.google.com/macros/s/AKfycbwy1nj82p6D1kYc6cv--IrWp4aK6vtMrC1zXy5Ba5URYbLLmFkKgiyP_rBCrUYQktedXw/exec?callback=${callbackName}`;
    document.body.appendChild(script);
}

loadCategory();
