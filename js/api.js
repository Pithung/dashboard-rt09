const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJY3o6xqWfnPCUwppO1E1ZegxWyVG6yYpSm-mhd15rd-LQzFjRPVhi-5tiUjs7jz99/exec';

async function fetchFromAppsScript(action, params = {}) {
    let url = `${APPS_SCRIPT_URL}?action=${encodeURIComponent(action)}`;
    for (const key in params) {
        url += `&${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

function formatRupiah(angka) {
    if (!angka || isNaN(angka)) return "Rp 0";
    return "Rp " + Number(angka).toLocaleString('id-ID');
}
