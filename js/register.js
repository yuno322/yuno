document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('team-registration-form');
    const playersList = document.getElementById('players-list');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const captainSelect = document.getElementById('team-captain');
    const logoInput = document.getElementById('team-logo');
    const logoPreview = document.getElementById('logo-preview');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    
    let players = [];
    let teamLogo = null;

    // Добавление игрока
    function addPlayer() {
        const playerId = Date.now();
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.dataset.id = playerId;
        
        playerItem.innerHTML = `
            <div class="form-group">
                <label for="player-${playerId}-name">Игрок ${players.length + 1}</label>
                <input type="text" id="player-${playerId}-name" class="player-name-input" required>
            </div>
            <div class="form-group">
                <label for="player-${playerId}-ign">Nickname в Valorant*</label>
                <input type="text" id="player-${playerId}-ign" class="player-ign-input" required>
            </div>
            <div class="form-group">
                <label for="player-${playerId}-role">Роль*</label>
                <select id="player-${playerId}-role" class="player-role-select" required>
                    <option value="">Выберите роль</option>
                    <option value="duelist">Дуэлянт</option>
                    <option value="initiator">Инициатор</option>
                    <option value="controller">Контроллер</option>
                    <option value="sentinel">Страж</option>
                </select>
            </div>
            <button type="button" class="btn btn-small btn-outline remove-player">
                <i class="fas fa-times"></i> Удалить
            </button>
        `;
        
        playersList.appendChild(playerItem);
        
        // Добавляем обработчик удаления
        playerItem.querySelector('.remove-player').addEventListener('click', function() {
            removePlayer(playerId);
        });
        
        // Добавляем игрока в массив
        players.push({
            id: playerId,
            element: playerItem,
            nameInput: playerItem.querySelector('.player-name-input'),
            ignInput: playerItem.querySelector('.player-ign-input'),
            roleSelect: playerItem.querySelector('.player-role-select')
        });
        
        // Обновляем список капитанов
        updateCaptainSelect();
    }
    
    // Удаление игрока
    function removePlayer(playerId) {
        const playerIndex = players.findIndex(p => p.id == playerId);
        if (playerIndex !== -1) {
            players.splice(playerIndex, 1);
        }
        
        const playerElement = document.querySelector(`.player-item[data-id="${playerId}"]`);
        if (playerElement) {
            playerElement.remove();
        }
        
        // Перенумеровываем оставшихся игроков
        const playerItems = playersList.querySelectorAll('.player-item');
        playerItems.forEach((item, index) => {
            item.querySelector('label').textContent = `Игрок ${index + 1}`;
        });
        
        updateCaptainSelect();
    }
    
    // Обновление списка капитанов
    function updateCaptainSelect() {
        captainSelect.innerHTML = '<option value="">Выберите капитана</option>';
        
        if (players.length >= 5) {
            captainSelect.disabled = false;
            
            players.forEach((player, index) => {
                const option = document.createElement('option');
                option.value = player.id;
                option.textContent = `Игрок ${index + 1} (${player.ignInput.value || 'нет nick'})`;
                captainSelect.appendChild(option);
            });
        } else {
            captainSelect.disabled = true;
        }
    }
    
    // Превью логотипа
    logoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                logoPreview.innerHTML = `
                    <img src="${e.target.result}" alt="Превью логотипа">
                    <button type="button" class="btn btn-small btn-outline remove-logo">
                        <i class="fas fa-times"></i> Удалить
                    </button>
                `;
                
                teamLogo = e.target.result;
                
                // Обработчик удаления логотипа
                logoPreview.querySelector('.remove-logo').addEventListener('click', function() {
                    logoInput.value = '';
                    logoPreview.innerHTML = '';
                    teamLogo = null;
                });
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Добавление игроков по умолчанию
    for (let i = 0; i < 5; i++) {
        addPlayer();
    }
    
    // Обработка формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Проверка минимального количества игроков
        if (players.length < 5) {
            alert('Команда должна состоять минимум из 5 игроков');
            return;
        }
        
        // Проверяем, что все поля заполнены
        for (const player of players) {
            if (!player.nameInput.value || !player.ignInput.value || !player.roleSelect.value) {
                alert('Заполните все поля игроков');
                return;
            }
        }
        
        // Проверяем обязательные поля команды
        if (!form.querySelector('#team-name').value || 
            !form.querySelector('#team-tag').value || 
            !teamLogo || 
            !form.querySelector('#contact-email').value || 
            !form.querySelector('#agree-rules').checked) {
            alert('Заполните все обязательные поля');
            return;
        }
        
        // Собираем данные команды
        const teamData = {
            id: Date.now(),
            name: form.querySelector('#team-name').value,
            tag: form.querySelector('#team-tag').value,
            logo: teamLogo,
            captain: {
                id: captainSelect.value,
                name: players.find(p => p.id == captainSelect.value)?.nameInput.value || 'Неизвестно'
            },
            players: players.map(player => ({
                name: player.nameInput.value,
                ign: player.ignInput.value,
                role: player.roleSelect.value
            })),
            contact: {
                email: form.querySelector('#contact-email').value,
                phone: form.querySelector('#contact-phone').value || null
            },
            registrationDate: new Date().toISOString(),
            status: 'pending'
        };
        
        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').style.display = 'none';
        submitBtn.querySelector('.loading-spinner').style.display = 'inline-block';
        
        try {
            // Сохраняем в localStorage
            const existingTeams = JSON.parse(localStorage.getItem('valorantTeams')) || [];
            existingTeams.push(teamData);
            localStorage.setItem('valorantTeams', JSON.stringify(existingTeams));
            
            // Имитация задержки сервера
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Показываем сообщение об успехе
            form.style.display = 'none';
            successMessage.style.display = 'block';
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.submit-text').style.display = 'inline-block';
            submitBtn.querySelector('.loading-spinner').style.display = 'none';
        }
    });
    
    // Добавление игроков
    addPlayerBtn.addEventListener('click', addPlayer);
    
    // Обновление списка капитанов при изменении nicknames
    playersList.addEventListener('input', function(e) {
        if (e.target.classList.contains('player-ign-input')) {
            updateCaptainSelect();
        }
    });
});