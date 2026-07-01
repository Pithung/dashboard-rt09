function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) applyDarkTheme();
}

function applyDarkTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeIcon').className = 'bx bx-sun';
    document.getElementById('metaThemeColor').setAttribute('content', '#0f172a');
}

function removeDarkTheme() {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('themeIcon').className = 'bx bx-moon';
    document.getElementById('metaThemeColor').setAttribute('content', '#ffffff');
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        removeDarkTheme();
        localStorage.setItem('theme', 'light');
    } else {
        applyDarkTheme();
        localStorage.setItem('theme', 'dark');
    }
    
    // Refresh charts to update colors
    if (typeof renderChart === 'function' && currentChartData) renderChart(currentChartData);
    if (typeof renderKasDetail === 'function' && kasDataCache) renderKasDetail();
}
