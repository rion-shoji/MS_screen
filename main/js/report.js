document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Active State ---
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // --- Logout Button Confirmation ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => { 
            const confirmed = confirm('Are you sure you want to logout?');
            if (!confirmed) {
                e.preventDefault();
            }
        });
    }
});