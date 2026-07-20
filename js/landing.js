function toggleNavbar() {
    document.getElementById('navbarMenu').classList.toggle('open');
    document.getElementById('mobileNavOverlay').classList.toggle('open');
    document.getElementById('navBurger').classList.toggle('active');
}

function setActiveNavOnScroll() {
    const sections = ['beranda', 'tentang', 'info'];
    const links = document.querySelectorAll('.navbar-link');
    let current = 'beranda';
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
    });
    links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
}

function animateValue(el, value) {
    if (!el) return;
    el.textContent = value;
}

async function loadLandingData() {
    const hariIni = new Date();
    const daftarBulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const bln = daftarBulan[hariIni.getMonth()];
    const thn = hariIni.getFullYear().toString();

    try {
        const res = await fetchFromAppsScript('getDataDashboard', { bulan: bln, tahun: thn });

        document.getElementById('heroCardPeriod').textContent = bln + ' ' + thn;
        document.getElementById('heroIncome').textContent = formatRupiah(res.pemasukan);
        document.getElementById('heroOutcome').textContent = formatRupiah(res.pengeluaran);
        document.getElementById('heroSaldo').textContent = formatRupiah(res.saldoTotal);

        document.getElementById('statIncome').textContent = formatRupiah(res.pemasukan);
        document.getElementById('statOutcome').textContent = formatRupiah(res.pengeluaran);
        document.getElementById('statTotal').textContent = formatRupiah(res.saldoTotal);

        document.getElementById('miniSaldo').textContent = formatRupiah(res.saldoTotal).replace('Rp ', 'Rp');
        document.getElementById('heroKasRT').textContent = formatRupiah(res.saldoTotal);

        const pct = (res.pemasukan + res.pengeluaran) > 0
            ? Math.min(100, (res.pengeluaran / (res.pemasukan + res.pengeluaran)) * 100)
            : 0;
        document.getElementById('heroBarFill').style.width = pct.toFixed(1) + '%';
    } catch (err) {
        console.warn('Gagal memuat data landing:', err);
    }

    document.getElementById('miniWarga').textContent = '—';
    document.getElementById('miniAcara').textContent = '3';
}

function onScroll() {
    setActiveNavOnScroll();
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onScroll);
window.onload = function () {
    initTheme();
    loadLandingData();
    setActiveNavOnScroll();
};
