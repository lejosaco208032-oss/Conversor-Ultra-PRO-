


const currencyCountryCode={USD:"us",EUR:"eu",GBP:"gb",JPY:"jp",CAD:"ca",AUD:"au",CNY:"cn",MXN:"mx",COP:"co",BRL:"br"};
const currencies=["USD","EUR","GBP","JPY","CAD","AUD","CNY","MXN","COP","BRL"];
const fromSelect=document.getElementById("fromCurrency");
const toSelect=document.getElementById("toCurrency");
const amountInput=document.getElementById("amount");
const resultText=document.getElementById("resultText");
let chart;

// Llenado de monedas
currencies.forEach(c => {
    fromSelect.add(new Option(c, c));
    toSelect.add(new Option(c, c));
});
fromSelect.value = "USD";
toSelect.value = "COP";

function updateFlags() {
    document.getElementById("flagFrom").src = `https://flagcdn.com/w40/${currencyCountryCode[fromSelect.value]}.png`;
    document.getElementById("flagTo").src = `https://flagcdn.com/w40/${currencyCountryCode[toSelect.value]}.png`;
}

// CONVERSIÓN AUTOMÁTICA PROFESIONAL
async function convert() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) { resultText.innerText = "0.00"; return; }

    resultText.style.opacity = "0.6";
    try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromSelect.value}`);
        const data = await assets/res.json();
        const rate = data.rates[toSelect.value];
        const total = (amount * rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        resultText.innerText = `${total} ${toSelect.value}`;
        updateChart(rate);
    } catch (e) { resultText.innerText = "Error API"; }
    resultText.style.opacity = "1";
}

function updateChart(rate) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [rate*0.995, rate*1.005, rate*0.998, rate*1.002, rate*0.999, rate],
                borderColor: '#38bdf8', borderWidth: 3, pointRadius: 0, tension: 0.4,
                fill: true, backgroundColor: 'rgba(56, 189, 248, 0.1)'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

function swapCurrencies() {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    updateFlags(); convert();
}

// Listeners Automáticos
fromSelect.addEventListener("change", () => { updateFlags(); convert(); });
toSelect.addEventListener("change", () => { updateFlags(); convert(); });
amountInput.addEventListener("input", () => {
    clearTimeout(window.timer);
    window.timer = setTimeout(convert, 350); 
});

window.onload = () => { updateFlags(); convert(); };
