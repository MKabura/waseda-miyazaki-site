async function loadArticle() {
    const endpoint = "https://script.google.com/macros/s/AKfycbyUcTaFeinmyI69fZuMLDWs-NARzO70uy-j-LSoutlakfGI9SgWkS5Tm62fjQQ68ELE_A/exec";

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(endpoint);
    const items = await res.json();

    const article = items.find(item => item.id === id);

    if (!article) {
        document.getElementById("news-article").innerHTML = "<p>記事が見つかりません。</p>";
        return;
    }
    document.getElementById("article-title").textContent = article.title;
    document.getElementById("article-date").textContent = article.date;
    document.getElementById("article-image").src = "images/" + article.image;
    document.getElementById("article-body").innerHTML = article.body;
}

loadArticle();

// const article = items.find(item => item.id === id);

// if (!article) {
//     document.getElementById("news-article").innerHTML = "<p>記事が見つかりません。</p>";
//     return;
// }

// document.getElementById("article-title").textContent = article.title || 'タイトルなし';
// document.getElementById("article-date").textContent = article.date || '';

// // --- 画像エラー対策 ---
// const imgElement = document.getElementById("article-image");
// const defaultImage = "images/default.jpg"; // デフォルト画像のパス

// // 1. データ自体が空、または無い場合のチェック
// imgElement.src = article.image ? "images/" + article.image : defaultImage;

// // 2. サーバー側に画像がなくて404エラーになった場合の処理（無限ループ防止付き）
// imgElement.onerror = function() {
//     if (this.src !== window.location.origin + "/" + defaultImage) {
//         this.src = defaultImage;
//     } else {
//         this.onerror = null; // デフォルト画像も無ければエラー処理を解除
//     }
// };
// // ----------------------

// document.getElementById("article-body").innerHTML = article.body || '';
// }

// loadArticle();