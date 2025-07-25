document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('admin-login-form');
    const errorMessage = document.getElementById('login-error');
    
    const ADMIN_CREDENTIALS = {
        username: "admin",
        password: "Valorant2025" 
    };
    

    if (localStorage.getItem('adminAuthenticated') === 'true') {
        window.location.href = 'admin.html';
    }
    

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').style.display = 'none';
        submitBtn.querySelector('.loading-spinner').style.display = 'inline-block';
        

        setTimeout(() => {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('adminAuthenticated', 'true');
                window.location.href = 'admin.html';
            } else {
                errorMessage.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.querySelector('.submit-text').style.display = 'inline-block';
                submitBtn.querySelector('.loading-spinner').style.display = 'none';
            }
        }, 1000);
    });
});