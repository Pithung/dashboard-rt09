let myKasChart = null;
let kasDataCache = null;

async function loadKasData() {
    const thn = document.getElementById("filterTahunKas").value;
    document.getElementById("tabelKasBody").innerHTML = '<tr><td colspan="5" class="empty-state"><i class="bx bx-loader-alt bx-spin"></i> Menarik data...</td></tr>';

    try {
        const res = await fetchFromAppsScript('getKasData', { tahun: thn });
        kasDataCache = res;
        document.getElementById("txtKasPotongan").innerText = formatRupiah(res.summary.potongan);
        document.getElementById("txtKasRT").innerText = formatRupiah(res.summary.rt);
        document.getElementById("txtKasSosial").innerText = formatRupiah(res.summary.sosial);
        document.getElementById("txtKasMerti").innerText = formatRupiah(res.summary.merti);
        document.getElementById("txtKas17").innerText = formatRupiah(res.summary.tujuhbelas);
        renderKasDetail();
    } catch (err) {
        document.getElementById("tabelKasBody").innerHTML = '<tr><td colspan="5" class="empty-state"><i class="bx bx-error-circle"></i> Gagal memuat data kas.</td></tr>';
    }
}

function renderKasDetail() {
    if (!kasDataCache) return;
    const jenis = document.getElementById("pilihJenisKas").value;
    const dataDipilih = kasDataCache.riwayat[jenis];
    const allMonthsLabel = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    let tbody = "";
    let rekapBulan = {};

    if (dataDipilih && dataDipilih.length > 0) {
        dataDipilih.forEach(item => {
            if (!rekapBulan[item.bulanIndex]) rekapBulan[item.bulanIndex] = { masuk: 0, keluar: 0 };
            rekapBulan[item.bulanIndex].masuk += item.masuk;
            rekapBulan[item.bulanIndex].keluar += item.keluar;

            tbody += `<tr>
                <td>${item.tanggal}</td>
                <td>${item.keterangan}</td>
                <td style="text-align:right;" class="text-success-custom">${item.masuk > 0 ? formatRupiah(item.masuk) : '-'}</td>
                <td style="text-align:right;" class="text-danger-custom">${item.keluar > 0 ? formatRupiah(item.keluar) : '-'}</td>
                <td style="text-align:right; font-weight:700;">${formatRupiah(item.saldo)}</td>
            </tr>`;
        });
    } else {
        tbody = '<tr><td colspan="5" class="empty-state"><i class="bx bx-info-circle"></i> Tidak ada data</td></tr>';
    }

    const labels = allMonthsLabel;
    const dataMasuk = [];
    const dataKeluar = [];

    allMonthsLabel.forEach((_, index) => {
        const val = rekapBulan[index] || { masuk: 0, keluar: 0 };
        dataMasuk.push(val.masuk);
        // KUNCI: Ubah pengeluaran menjadi NEGATIF agar batang tumbuh ke bawah ok
        dataKeluar.push(val.keluar * -1); 
    });

    renderChartKas(labels, dataMasuk, dataKeluar);
    document.getElementById("tabelKasBody").innerHTML = tbody;
}
function renderChartKas(labels, dataMasuk, dataKeluar) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    const container = document.getElementById('chartKasContainer');
    container.style.minWidth = '800px'; 

    const ctx = document.getElementById('chartKas').getContext('2d');
    if (myKasChart) myKasChart.destroy();
    
    myKasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { 
                    label: 'Masuk', 
                    data: dataMasuk, 
                    backgroundColor: 'rgba(34,197,94,0.8)', 
                    borderRadius: 6,
                },
                { 
                    label: 'Keluar', 
                    data: dataKeluar, 
                    backgroundColor: 'rgba(239,68,68,0.8)', 
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: gridColor }, 
                    ticks: { 
                        color: textColor,
                        // KUNCI: Ubah angka negatif di sumbu Y menjadi positif agar tidak muncul tanda minus (-)
                        callback: function(value) { return Math.abs(value).toLocaleString('id-ID'); }
                    } 
                },
                x: { 
                    offset: true, 
                    grid: { display: false }, 
                    ticks: { 
                        color: textColor,
                        font: { family: 'DM Sans', weight: '500' }
                    } 
                }
            },
            plugins: {
                legend: { 
                    labels: { color: textColor, font: { family: 'DM Sans' } } 
                },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    titleColor: isDark ? '#f1f5f9' : '#1e293b',
                    bodyColor: isDark ? '#cbd5e1' : '#64748b',
                    callbacks: {
                        // KUNCI: Ubah angka negatif di tooltip menjadi positif
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = Math.abs(context.parsed.y);
                            return `${label}: Rp ${value.toLocaleString('id-ID')}`;
                        }
                    }
                }
            }
        }
    });
}
