document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const mobileToggle = document.getElementById('mobileToggle');
    const overlay = document.getElementById('overlay');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    // 1. Toggle en desktop: colapsar sidebar
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            if (!isMobile()) {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // 2. Toggle en móvil: mostrar/ocultar sidebar
    if (mobileToggle && overlay) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.add('show');
            overlay.classList.add('active');
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            overlay.classList.remove('active');
        });
    }

    // 3. Dropdowns del sidebar
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdown = this.nextElementSibling;
            const arrow = this.querySelector('.dropdown-arrow');

            dropdownToggles.forEach(other => {
                if (other !== toggle) {
                    other.nextElementSibling.classList.remove('show');
                    other.querySelector('.dropdown-arrow').classList.remove('rotated');
                }
            });

            dropdown.classList.toggle('show');
            arrow.classList.toggle('rotated');
        });
    });

    // 4. Dropdown de usuario
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // 5. Manejo de redimensionado
    function handleResize() {
        if (!isMobile()) {
            sidebar.classList.remove('show');
            overlay?.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});