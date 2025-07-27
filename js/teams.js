document.addEventListener('DOMContentLoaded', function() {
    const teamsContainer = document.getElementById('teams-container');
    const searchInput = document.getElementById('teams-search');
    const groupFilter = document.getElementById('group-filter');

    // Загрузка подтверждённых команд
    function loadApprovedTeams() {
        const allTeams = JSON.parse(localStorage.getItem('valorantTeams')) || [];
        return allTeams.filter(team => team.status === 'approved');
    }

    // Отображение команд
    function renderTeams(teams) {
        teamsContainer.innerHTML = '';

        if (teams.length === 0) {
            teamsContainer.innerHTML = '<p class="no-teams">Нет подтверждённых команд</p>';
            return;
        }

        teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';

            teamCard.innerHTML = `
                <div class="team-header">
                    ${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="team-logo">` : ''}
                    <div class="team-info">
                        <h3>${team.name} <span class="team-tag">${team.tag}</span></h3>
                        <p class="team-captain">Капитан: ${team.captain.name}</p>
                    </div>
                </div>
                <div class="team-players">
                    <h4>Состав:</h4>
                    <ul>
                        ${team.players.map(player => `
                            <li>
                                <span class="player-ign">${player.ign}</span>
                                <span class="player-name">${player.name}</span>
                                <span class="player-role ${player.role}">${getRoleName(player.role)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="team-meta">
                    <span class="registration-date">Зарегистрирована: ${formatDate(team.registrationDate)}</span>
                </div>
            `;

            teamsContainer.appendChild(teamCard);
        });
    }

    // Фильтрация команд
    function filterTeams() {
        const searchTerm = searchInput.value.toLowerCase();
        const group = groupFilter.value;
        const teams = loadApprovedTeams();

        const filteredTeams = teams.filter(team => {
            const matchesSearch = team.name.toLowerCase().includes(searchTerm) || 
                                team.tag.toLowerCase().includes(searchTerm) ||
                                team.captain.name.toLowerCase().includes(searchTerm);
            const matchesGroup = group === 'all' || team.group === group;
            return matchesSearch && matchesGroup;
        });

        renderTeams(filteredTeams);
    }

    // Вспомогательные функции
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    function getRoleName(roleKey) {
        const roles = {
            'duelist': 'Дуэлянт',
            'initiator': 'Инициатор',
            'controller': 'Контроллер',
            'sentinel': 'Страж'
        };
        return roles[roleKey] || roleKey;
    }

    // Инициализация
    searchInput.addEventListener('input', filterTeams);
    groupFilter.addEventListener('change', filterTeams);

    // Первоначальная загрузка
    renderTeams(loadApprovedTeams());
});