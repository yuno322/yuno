document.addEventListener('DOMContentLoaded', function() {
    // Бургер меню
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });
    
    // Карусель команд
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    // Генерация карточек команд
    const teams = [
        { name: 'Team Liquid', logo: 'team1.png', players: 's1mple, electronic, NAF, EliGE, nitr0', rating: 5 },
        { name: 'Gambit Esports', logo: 'team2.png', players: 'sh1ro, interz, Hobbit, nafany, Ax1Le', rating: 5 },
        { name: 'Natus Vincere', logo: 'team3.png', players: 'b1t, sdy, electroNic, Perfecto, s1mple', rating: 4 },
        { name: 'Fnatic', logo: 'team4.png', players: 'Boaster, Derke, Alfajer, Chronicle, Leo', rating: 4 },
        { name: 'DRX', logo: 'team5.png', players: 'Rb, Zest, stax, BuZz, MaKo', rating: 4 },
        { name: 'LOUD', logo: 'team6.png', players: 'aspas, Less, saadhak, cauanzin, tuyz', rating: 3 }
    ];
    
    function renderTeams() {
        carouselTrack.innerHTML = '';
        
        teams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card hover-grow';
            
            let stars = '';
            for (let i = 0; i < team.rating; i++) {
                stars += '<span class="rating-star">★</span>';
            }
            
            teamCard.innerHTML = `
                <div class="team-logo">
                    <img src="img/teams/${team.logo}" alt="${team.name}">
                </div>
                <div class="team-info">
                    <h4 class="team-name">${team.name}</h4>
                    <p class="team-players">${team.players}</p>
                    <div class="team-rating">${stars}</div>
                </div>
            `;
            
            carouselTrack.appendChild(teamCard);
        });
        
        updateCarousel();
    }
    
    function updateCarousel() {
        const cardWidth = document.querySelector('.team-card').offsetWidth + 30;
        carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    
    nextBtn.addEventListener('click', function() {
        if (currentIndex < teams.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Генерация новостей
    const newsGrid = document.querySelector('.news-grid');
    
    const news = [
        { 
            title: 'Открыта регистрация на Valorant Masters', 
            date: '15.10.2023', 
            image: 'news1.jpg', 
            excerpt: 'Регистрация на крупнейший турнир по Valorant в СНГ открыта до 30 октября.' 
        },
        { 
            title: 'Призовой фонд увеличен до 1 000 000₽', 
            date: '10.10.2023', 
            image: 'news2.jpg', 
            excerpt: 'Благодаря новым спонсорам призовой фонд турнира увеличен вдвое.' 
        },
        { 
            title: 'Изменения в формате турнира', 
            date: '05.10.2023', 
            image: 'news3.jpg', 
            excerpt: 'Организаторы объявили о переходе на формат Double Elimination BO3.' 
        }
    ];
    
    function renderNews() {
        newsGrid.innerHTML = '';
        
        news.forEach(item => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            
            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="img/news/${item.image}" alt="${item.title}">
                </div>
                <div class="news-content">
                    <p class="news-date">${item.date}</p>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <a href="news-detail.html" class="read-more">Читать далее</a>
                </div>
            `;
            
            newsGrid.appendChild(newsCard);
        });
    }
    
    // Инициализация
    renderTeams();
    renderNews();
    
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.slide-up, .flip-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Инициализация при загрузке
});