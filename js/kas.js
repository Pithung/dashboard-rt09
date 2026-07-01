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
    const daftarBulanLabel = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    let tbody = "";
    let rekapBulan = {};

    if (!dataDipilih || dataDipilih.length === 0) {
        tbody = '<tr><td colspan="5" class="empty-state"><i class="bx bx-info-circle"></i> Tidak ada data</td></tr>';
        renderChartKas([], [], []);
    } else {
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

        const labels = [], masuk = [], keluar = [];
        Object.keys(rekapBulan).sort((a,b) => a-b).forEach(k => {
            labels.push(daftarBulanLabel[k]);
            masuk.push(rekapBulan[k].masuk);
            keluar.push(rekapBulan[k].keluar);
        });
        renderChartKas(labels, masuk, keluar);
    }
    document.getElementById("tabelKasBody").innerHTML = tbody;
}

function renderChartKas(labels, dataMasuk, dataKeluar) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    const ctx = document.getElementById('chartKas').getContext('2d');
    if (myKasChart) myKasChart.destroy();
    
    myKasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Masuk', data: dataMasuk, backgroundColor: 'rgba(34,197,94,0.8)', borderRadius: 6 },
                { label: 'Keluar', data: dataKeluar, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
                x: { grid: { display: false }, ticks: { color: textColor } }
            },
            plugins: {
                legend: { labels: { color: textColor } }
            }
        }
    });
}
