// Javascript to handle haptic feedback and simple page navigation

function addHapticToButtons() {
    // Add haptic feedback to all interactive elements
    const elements = document.querySelectorAll('button, a, .cursor-pointer, [onclick]');
    elements.forEach(el => {
        el.addEventListener('click', () => {
            if (window.AndroidInterface && typeof window.AndroidInterface.performHapticFeedback === 'function') {
                window.AndroidInterface.performHapticFeedback();
            }
        });
    });
}

function handleNavigation() {
    // Some buttons have onclick="selectRole(this, 'sme')" or similar
    if (typeof window.selectRole !== 'undefined') {
        const originalSelectRole = window.selectRole;
        window.selectRole = function(element, role) {
            originalSelectRole(element, role);
            if (window.AndroidInterface && typeof window.AndroidInterface.performHapticFeedback === 'function') {
                window.AndroidInterface.performHapticFeedback();
            }

            // Wait for animation then navigate
            setTimeout(() => {
                if (role === 'sme') {
                    window.location.href = getUrlWithMode('sme-dashboard.html');
                } else if (role === 'investor') {
                    window.location.href = getUrlWithMode('investor-dashboard.html');
                }
            }, 300);
        };
    } else {
        // Fallback for selectRole if not defined in the page script
        window.selectRole = function(element, role) {
            if (window.AndroidInterface && typeof window.AndroidInterface.performHapticFeedback === 'function') {
                window.AndroidInterface.performHapticFeedback();
            }

            // highlight selection
            document.querySelectorAll('.role-card').forEach(c => c.style.borderColor = 'transparent');
            element.style.borderColor = '#00725b';

            setTimeout(() => {
                if (role === 'sme') {
                    window.location.href = getUrlWithMode('sme-dashboard.html');
                } else if (role === 'investor') {
                    window.location.href = getUrlWithMode('investor-dashboard.html');
                }
            }, 300);
        }
    }

    // Add navigation to other common buttons like "Continue" or "Get Started"
    // Find continue buttons
    const continueButtons = document.querySelectorAll('button');
    continueButtons.forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();

        if (text === 'continue' || text === 'get started') {
            btn.addEventListener('click', () => {
                // Determine destination based on current page
                const currentPath = window.location.pathname;

                if (currentPath.includes('onboarding-and-access')) {
                    window.location.href = getUrlWithMode('select-your-role.html');
                } else if (currentPath.includes('sme-dashboard')) {
                    window.location.href = getUrlWithMode('funding-request.html');
                } else if (currentPath.includes('investor-dashboard')) {
                    // Stay on investor dashboard for now or go back
                } else if (currentPath.includes('select-your-role')) {
                    // handled by selectRole
                }
            });
        }

        // Back buttons
        if (btn.querySelector('.material-symbols-outlined') && btn.querySelector('.material-symbols-outlined').textContent.trim() === 'arrow_back') {
            btn.addEventListener('click', () => {
                window.history.back();
            });
        }
    });
}

function getUrlWithMode(baseUrl) {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        return baseUrl.replace('.html', '-dark.html');
    }
    return baseUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    addHapticToButtons();
    handleNavigation();
});

// A function for pages to call to request notification (reminders)
window.requestReminder = function(title, message) {
    if (window.AndroidInterface && typeof window.AndroidInterface.showNotification === 'function') {
        window.AndroidInterface.showNotification(title, message);
    }
}

// Global Dark Mode state management
function initDarkMode() {
    // Initialize dark mode if not set
    if (localStorage.getItem('darkMode') === null) {
        localStorage.setItem('darkMode', 'false'); // Default light
    }

    window.toggleDarkMode = function() {
        const currentlyDark = localStorage.getItem('darkMode') === 'true';
        const newDark = !currentlyDark;
        localStorage.setItem('darkMode', newDark);

        let currentPath = window.location.pathname.split('/').pop();
        let newPath;
        if (newDark) {
            newPath = currentPath.replace('.html', '-dark.html');
        } else {
            newPath = currentPath.replace('-dark.html', '.html');
        }

        // Navigation
        window.location.replace(newPath);
    };

    // Automatically redirect if we are on the wrong version
    const isDark = localStorage.getItem('darkMode') === 'true';
    const isDarkPage = window.location.pathname.includes('-dark.html');

    // Only redirect if the path actually has a dark/light version to prevent infinite loops
    // In our case, all our pages have both
    // Actually, to prevent infinite loops, let's only redirect if we just loaded the page and mismatch
    if (isDark && !isDarkPage && window.location.pathname !== '/android_asset/www/index.html') {
         let newPath = window.location.pathname.split('/').pop().replace('.html', '-dark.html');
         window.location.replace(newPath);
    } else if (!isDark && isDarkPage && window.location.pathname !== '/android_asset/www/index.html') {
         let newPath = window.location.pathname.split('/').pop().replace('-dark.html', '.html');
         window.location.replace(newPath);
    }
}

initDarkMode();
