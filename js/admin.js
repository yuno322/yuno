// Проверка авторизации
if (localStorage.getItem('adminAuthenticated') !== 'true') {
    window.location.href = 'admin-login.html';
}

// Инициализация данных
let currentEditingId = null;
const API = {
    news: {
        getAll: () => JSON.parse(localStorage.getItem('valorantNews')) || [],
        save: (data) => localStorage.setItem('valorantNews', JSON.stringify(data)),
        delete: (id) => {
            const news = API.news.getAll().filter(item => item.id !== id);
            API.news.save(news);
        }
    },
    teams: {
        getAll: () => JSON.parse(localStorage.getItem('valorantTeams')) || [],
        save: (data) => localStorage.setItem('valorantTeams', JSON.stringify(data)),
        updateStatus: (id, status) => {
            const teams = API.teams.getAll();
            const team = teams.find(t => t.id == id);
            if (team) {
                team.status = status;
                API.teams.save(teams);
            }
        }
    }
};

// ========== ОБЩИЕ ФУНКЦИИ ==========
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ========== НОВОСТИ ==========
function renderNewsTable() {
    const news = API.news.getAll();
    const tbody = document.getElementById('news-table-body');
    tbody.innerHTML = '';

    news.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${formatDate(item.date)}</td>
            <td><span class="status-badge ${item.status === 'published' ? 'published' : 'draft'}">
                ${item.status === 'published' ? 'Опубликовано' : 'Черновик'}
            </span></td>
            <td>
                <button class="btn-action edit-news" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete-news" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Добавляем обработчики
    document.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', () => editNews(btn.dataset.id));
    });

    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', () => deleteNews(btn.dataset.id));
    });
}

function editNews(id) {
    const news = API.news.getAll().find(item => item.id == id);
    if (!news) return;

    currentEditingId = id;
    document.getElementById('news-modal-title').textContent = 'Редактировать новость';
    document.getElementById('news-id').value = news.id;
    document.getElementById('news-title').value = news.title;
    document.getElementById('news-content').value = news.content;
    document.getElementById('news-status').value = news.status;
    
    const preview = document.getElementById('image-preview');
    if (news.image) {
        preview.innerHTML = `<img src="${news.image}" alt="Превью">`;
    } else {
        preview.innerHTML = '';
    }

    document.getElementById('news-modal').style.display = 'flex';
}

function deleteNews(id) {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
        API.news.delete(id);
        renderNewsTable();
        updateNewsPage();
    }
}

// ========== КОМАНДЫ ==========
function renderTeamsTable() {
    const teams = API.teams.getAll();
    const tbody = document.getElementById('teams-table-body');
    tbody.innerHTML = '';

    teams.forEach(team => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${team.id}</td>
            <td>
                <div class="team-info">
                    ${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="team-logo">` : ''}
                    <span>${team.name} <small>${team.tag}</small></span>
                </div>
            </td>
            <td>${team.captain.name}</td>
            <td>${formatDate(team.registrationDate)}</td>
            <td><span class="status-badge ${team.status}">
                ${getStatusText(team.status)}
            </span></td>
            <td>
                <button class="btn-action view-team" data-id="${team.id}">
                    <i class="fas fa-eye"></i>
                </button>
                ${team.status === 'pending' ? `
                <button class="btn-action approve-team" data-id="${team.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-action reject-team" data-id="${team.id}">
                    <i class="fas fa-times"></i>
                </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Добавляем обработчики
    document.querySelectorAll('.view-team').forEach(btn => {
        btn.addEventListener('click', () => viewTeam(btn.dataset.id));
    });

    document.querySelectorAll('.approve-team').forEach(btn => {
        btn.addEventListener('click', () => approveTeam(btn.dataset.id));
    });

    document.querySelectorAll('.reject-team').forEach(btn => {
        btn.addEventListener('click', () => rejectTeam(btn.dataset.id));
    });
}

function getStatusText(status) {
    const statuses = {
        'pending': 'На рассмотрении',
        'approved': 'Подтверждена',
        'rejected': 'Отклонена'
    };
    return statuses[status] || status;
}

function viewTeam(id) {
    const team = API.teams.getAll().find(t => t.id == id);
    if (!team) return;

    const modalBody = document.getElementById('team-modal-body');
    modalBody.innerHTML = `
        <div class="team-header">
            ${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="team-logo-large">` : ''}
            <h3>${team.name} <small>${team.tag}</small></h3>
        </div>
        <div class="team-details">
            <p><strong>Капитан:</strong> ${team.captain.name}</p>
            <p><strong>Email:</strong> ${team.contact.email}</p>
            ${team.contact.phone ? `<p><strong>Телефон:</strong> ${team.contact.phone}</p>` : ''}
            <p><strong>Дата регистрации:</strong> ${formatDate(team.registrationDate)}</p>
            <p><strong>Статус:</strong> <span class="status-badge ${team.status}">${getStatusText(team.status)}</span></p>
        </div>
        <div class="team-players">
            <h4>Состав команды:</h4>
            <ul>
                ${team.players.map(player => `
                    <li>
                        <span class="player-name">${player.name}</span>
                        <span class="player-ign">${player.ign}</span>
                        <span class="player-role">${player.role}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Настройка кнопок в зависимости от статуса
    const approveBtn = document.getElementById('approve-team');
    const rejectBtn = document.getElementById('reject-team');
    
    if (team.status === 'pending') {
        approveBtn.style.display = 'inline-block';
        rejectBtn.style.display = 'inline-block';
        approveBtn.dataset.id = team.id;
        rejectBtn.dataset.id = team.id;
    } else {
        approveBtn.style.display = 'none';
        rejectBtn.style.display = 'none';
    }

    document.getElementById('team-modal').style.display = 'flex';
}

function approveTeam(id) {
    API.teams.updateStatus(id, 'approved');
    renderTeamsTable();
    updateTeamsPage();
    closeAllModals();
}

function rejectTeam(id) {
    API.teams.updateStatus(id, 'rejected');
    renderTeamsTable();
    closeAllModals();
}

// ========== ОБНОВЛЕНИЕ СТРАНИЦ ==========
function updateNewsPage() {
    // В реальном проекте здесь будет обновление страницы новостей
    console.log('News updated - should refresh news page');
}

function updateTeamsPage() {
    // В реальном проекте здесь будет обновление страницы команд
    console.log('Teams updated - should refresh teams page');
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация таблиц
    renderNewsTable();
    renderTeamsTable();

    // Обработчики модальных окон
    document.getElementById('add-news-btn').addEventListener('click', () => {
        currentEditingId = null;
        document.getElementById('news-form').reset();
        document.getElementById('news-modal-title').textContent = 'Добавить новость';
        document.getElementById('news-modal').style.display = 'flex';
    });

    document.getElementById('news-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newsItem = {
            id: currentEditingId || Date.now(),
            title: document.getElementById('news-title').value,
            content: document.getElementById('news-content').value,
            status: document.getElementById('news-status').value,
            date: new Date().toISOString(),
            author: 'Администратор',
            image: document.getElementById('image-preview').querySelector('img')?.src || ''
        };

        const news = API.news.getAll();
        if (currentEditingId) {
            const index = news.findIndex(item => item.id == currentEditingId);
            if (index !== -1) news[index] = newsItem;
        } else {
            news.push(newsItem);
        }

        API.news.save(news);
        renderNewsTable();
        updateNewsPage();
        closeAllModals();
    });

    // Обработчики закрытия модальных окон
    document.querySelectorAll('.close-modal, .btn-outline').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Выход из системы
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminAuthenticated');
        window.location.href = 'admin-login.html';
    });

    // Фильтрация команд
    document.getElementById('team-status-filter').addEventListener('change', function() {
        // В реальном проекте здесь будет фильтрация
        renderTeamsTable();
    });
});