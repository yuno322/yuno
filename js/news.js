document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');

    // Загрузка опубликованных новостей
    function loadPublishedNews() {
        const allNews = JSON.parse(localStorage.getItem('valorantNews')) || [];
        return allNews.filter(news => news.status === 'published');
    }

    // Отображение новостей
    function renderNews(news) {
        newsContainer.innerHTML = '';

        if (news.length === 0) {
            newsContainer.innerHTML = `
                <div class="no-news">
                    <i class="fas fa-newspaper"></i>
                    <p>Новостей пока нет</p>
                </div>
            `;
            return;
        }

        news.forEach(item => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <div class="news-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                </div>
                <div class="news-content">
                    <span class="news-date">${formatDate(item.date)}</span>
                    <h3>${item.title}</h3>
                    <p class="news-excerpt">${getExcerpt(item.content)}</p>
                    <a href="news-detail.html?id=${item.id}" class="read-more">
                        Читать далее <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        });
    }

    // Вспомогательные функции
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    function getExcerpt(text, length = 150) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    // Обновление при изменениях в админ-панели
    window.addEventListener('storage', function(e) {
        if (e.key === 'valorantNews') {
            renderNews(loadPublishedNews());
        }
    });

    // Первоначальная загрузка
    renderNews(loadPublishedNews());
});