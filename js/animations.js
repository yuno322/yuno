// Дополнительные анимации
document.addEventListener('DOMContentLoaded', function() {
    // Параллакс эффект для герой-секции
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    // Анимация частиц фона
    const bgAnimation = document.querySelector('.bg-animation');
    
    if (bgAnimation) {
        // Создаем дополнительные частицы
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'red-particle';
            
            // Рандомные параметры
            const size = Math.random() * 100 + 50;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.top = `${posY}%`;
            particle.style.left = `${posX}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            bgAnimation.appendChild(particle);
        }
    }
    
    // Анимация при наведении на кнопки
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = `0 0 15px ${this.classList.contains('btn-red') ? 'rgba(255, 70, 85, 0.7)' : 'rgba(255, 255, 255, 0.5)'}`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    // Анимация карточек при наведении
    const cards = document.querySelectorAll('.about-card, .news-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 30px rgba(255, 70, 85, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
        });
    });
    
    // Анимация социальных иконок
    const socialIcons = document.querySelectorAll('.social-icons a');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(10deg) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0) scale(1)';
        });
    });
});