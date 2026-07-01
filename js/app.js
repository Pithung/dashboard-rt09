function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('mobileOverlay').classList.toggle('open');
}

function switchPanel(panelId, el) {
    document.querySelectorAll('.dashboard-panel').forEach(p => p.classList.add('d-none'));
    document.getElementById('panel-' + panelId).classList.remove('d-none');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');

    const titles = {
        'siskamling': 'Keuangan Kamling RT 09',
        'kas': 'Keuangan RT 09'
    };
    document.getElementById('mainHeaderTitle').innerText = titles[panelId];

    if (panelId === 'kas') loadKasData();
    if (window.innerWidth <= 768) toggleSidebar();
}

window.onload = function() {
    initTheme();
    
    const hariIni = new Date();
    const daftarBulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const blnSkrg = daftarBulan[hariIni.getMonth()];
    const thnSkrg = hariIni.getFullYear().toString();

    if (document.getElementById("filterBulan")) document.getElementById("filterBulan").value = blnSkrg;
    if (document.getElementById("filterTahun")) document.getElementById("filterTahun").value = thnSkrg;
    if (document.getElementById("filterTahunKas")) document.getElementById("filterTahunKas").value = thnSkrg;

    loadDashboardData();
};
