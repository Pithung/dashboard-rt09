let myChart = null;
let currentChartData = null;

async function loadDashboardData() {
    const bln = document.getElementById("filterBulan").value;
    const thn = document.getElementById("filterTahun").value;
    
    const tbody = document.getElementById("tabelPengeluaranBody");
    tbody.innerHTML = '<tr><td colspan="3" class="empty-state"><i class="bx bx-loader-alt bx-spin"></i> Memuat data...</td></tr>';

    try {
        const res = await fetchFromAppsScript('getDataDashboard', { bulan: bln, tahun: thn });
        
        document.getElementById("lblIncome").innerText = `PEMASUKAN ${bln.toUpperCase()}`;
        document.getElementById("lblOutcome").innerText = `PENGELUARAN ${bln.toUpperCase()}`;
        document.getElementById("lblBalanceMonth").innerText = `SALDO ${bln.toUpperCase()}`;
        document.getElementById("lblTableTitle").innerText = `Pengeluaran Bulan ${bln}`;

        document.getElementById("txtIncome").innerText = formatRupiah(res.pemasukan);
        document.getElementById("txtOutcome").innerText = formatRupiah(res.pengeluaran);
        document.getElementById("txtBalanceMonth").innerText = formatRupiah(res.saldoBulan);
        document.getElementById("txtBalanceTotal").innerText = formatRupiah(res.saldoTotal);

        tbody.innerHTML = "";
        if (!res.riwayatPengeluaran || res.riwayatPengeluaran.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state"><i class="bx bx-info-circle"></i> Tidak ada pengeluaran bulan ini</td></tr>';
        } else {
            res.riwayatPengeluaran.forEach(item => {
                const btnBukti = item.bukti ? 
                    `<a href="${item.bukti}" target="_blank" class="btn-bukti"><i class="bx bx-show"></i></a>` : 
                    `<button class="btn-bukti btn-bukti-empty" disabled><i class="bx bx-hide"></i></button>`;
                
                tbody.innerHTML += `<tr>
                    <td>${item.tanggal}</td>
                    <td>${item.keterangan}</td>
                    <td style="text-align:right;" class="text-danger-custom">${btnBukti} ${formatRupiah(item.nominal)}</td>
                </tr>`;
            });
        }
        currentChartData = res.grafikHari;
        renderChart(currentChartData);
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state"><i class="bx bx-error-circle"></i> Gagal memuat data.</td></tr>';
    }
}

function renderChart(dataGrafik) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    const ctx = document.getElementById('chartJimpitan').getContext('2d');
    if (myChart) myChart.destroy();
    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            datasets: [{
                label: 'Total Setoran (Rp)',
                data: dataGrafik,
                backgroundColor: 'rgba(16,185,129,0.8)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
                x: { grid: { display: false }, ticks: { color: textColor } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    titleColor: isDark ? '#f1f5f9' : '#1e293b',
                    bodyColor: isDark ? '#cbd5e1' : '#64748b',
                }
            }
        }
    });
}
