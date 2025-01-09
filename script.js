const translations = {
    bm: {
        initialInvestment: "Pelaburan Permulaan (RM)",
        monthlyContribution: "Simpanan Bulanan (RM)",
        dividend: "Kadar Dividen Tahunan (%)",
        period: "Tempoh Pelaburan (Tahun)",
        calculate: "Kira",
        reset: "Tetapkan Semula",
        showTable: "Papar Perincian Pelaburan dalam Jadual",
        showTableHide: "Sembunyikan Perincian Pelaburan dalam Jadual",
        errorInitialInvestment: "Sila masukkan nombor positif yang sah",
        errorMonthlyContribution: "Sila masukkan nombor positif yang sah",
        errorDividend: "Sila masukkan peratusan yang sah antara 0 dan 100",
        errorPeriod: "Sila masukkan tempoh yang sah antara 1 hingga 200 tahun",
        totalPrincipal: "Jumlah Prinsipal (RM)",
        totalDividend: "Jumlah Dividen (RM)",
        totalValue: "Jumlah Nilai Pelaburan (RM)",
        year: "Tahun",
        principal: "Prinsipal (RM)",
        dividendtable: "Dividen (RM)",
        datasetTotalValue: "Jumlah Nilai Pelaburan",
        datasetPrincipal: "Prinsipal",
        datasetDividend: "Dividen",
        tooltipInitialInvestment: "Jumlah yang anda merancang untuk melabur pada mulanya untuk memulakan pelaburan ASNB anda.",
        tooltipMonthlyContribution: "Jumlah tambahan yang anda rancang untuk melabur setiap bulan untuk menambahkan pelaburan anda.",
        tooltipDividend: "Kadar faedah tahunan yang dijangkakan.",
        tooltipPeriod: "Bilangan tahun anda merancang untuk memegang pelaburan anda. Tempoh yang lebih panjang biasanya menghasilkan pulangan yang lebih baik."
},

    en: {
        initialInvestment: "Initial Investment (RM)",
        monthlyContribution: "Monthly Contribution (RM)",
        dividend: "Annual Dividend Rate (%)",
        period: "Investment Period (Years)",
        calculate: "Calculate",
        reset: "Reset",
        showTable: "Show Investment Details in Table",
        showTableHide: "Hide Investment Details in Table",
        errorInitialInvestment: "Please enter a valid positive number",
        errorMonthlyContribution: "Please enter a valid positive number",
        errorDividend: "Please enter a valid percentage between 0 and 100",
        errorPeriod: "Please enter a valid period between 1 and 200 years",
        totalPrincipal: "Total Principal(RM)",
        totalDividend: "Total Dividend(RM)",
        totalValue: "Total Investment Value (RM)",
        year: "Year",
        principal: "Principal (RM)",
        dividendtable: "Dividend (RM)",
        datasetTotalValue: "Total Investment Value",
        datasetPrincipal: "Principal",
        datasetDividend: "Dividend",
        tooltipInitialInvestment: "The amount you plan to invest upfront to start your ASNB investment.",
        tooltipMonthlyContribution: "Additional amount you plan to invest each month to grow your investment.",
        tooltipDividend: "Expected annual dividend rate.",
        tooltipPeriod: "Number of years you plan to hold your investment. Longer periods typically yield better returns."
    }
};

let currentLanguage = 'bm'; // Default language

function applyTranslations(language) {
    currentLanguage = language;
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[language][key]) {
            if (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'label' || el.tagName.toLowerCase() === 'div' || el.tagName.toLowerCase() === 'span' || el.tagName.toLowerCase() === 'th') {
                el.textContent = translations[language][key];
            } else if (el.tagName.toLowerCase() === 'input' && el.type === 'button') {
                el.value = translations[language][key];
            } else if (el.tagName.toLowerCase() === 'div' && el.classList.contains('disclaimer')) {
                el.innerHTML = translations[language][key];
            } else if (el.classList.contains('tooltip')) {
                el.textContent = translations[language][key];
            }
        }
    });

    const tableContainer = document.getElementById('tableContainer');
    const toggleTableButton = document.getElementById('toggleTable');
    if (tableContainer.style.display === 'none') {
        toggleTableButton.textContent = translations[language].showTable;
    } else {
        toggleTableButton.textContent = translations[language].showTableHide;
    }

    if (chart) {
        chart.data.datasets[0].label = translations[language].datasetTotalValue;
        chart.data.datasets[1].label = translations[language].datasetPrincipal;
        chart.data.datasets[2].label = translations[language].datasetDividend;

        chart.data.labels = chart.data.labels.map(label => {
            return label.replace(/Year/g, translations[language].year); // Replace "Year" with translated text
        });

        chart.update();
    }
}

function toggleLanguage(language) {
    const buttons = document.querySelectorAll('.language-option');
    buttons.forEach(button => {
        if (button.getAttribute('data-lang') === language) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    localStorage.setItem('language', language);
    applyTranslations(language);

    // Re-render the chart if it exists
    if (chart) {
        const results = calculateInvestment(
            parseFloat(document.getElementById('initialInvestment').value || 0),
            parseFloat(document.getElementById('monthlyContribution').value || 0),
            parseFloat(document.getElementById('dividend').value || 0),
            parseFloat(document.getElementById('period').value || 0)
        );
        updateChart(results.graphData);
    }
}

// Set default language on page load
document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.style.display = 'none';

    const savedLanguage = localStorage.getItem('language') || 'bm'; // Default to BM
    const buttons = document.querySelectorAll('.language-option');
    buttons.forEach(button => {
        if (button.getAttribute('data-lang') === savedLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    applyTranslations(savedLanguage);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
});

let chart = null;

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (chart) {
        const textColor = newTheme === 'dark' ? '#f7fafc' : '#2d3748';
        chart.options.plugins.legend.labels.color = textColor;
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.y.ticks.color = textColor;
        chart.update();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
});

function validateInputs() {
    const initialInvestment = document.getElementById('initialInvestment').value;
    const monthlyContribution = document.getElementById('monthlyContribution').value;
    const dividend = parseFloat(document.getElementById('dividend').value);
    const period = parseInt(document.getElementById('period').value);

    let isValid = true;

    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    let initialInvestmentValue = parseFloat(initialInvestment);
    if (initialInvestment.trim() === "") {
        initialInvestmentValue = 0; // Assume 0 if empty
    } else if (isNaN(initialInvestmentValue) || initialInvestmentValue < 0) {
        document.getElementById('initialInvestmentError').textContent = 'Please enter a valid positive number';
        isValid = false;
    }

    let monthlyContributionValue = parseFloat(monthlyContribution);
    if (monthlyContribution.trim() === "") {
        monthlyContributionValue = 0; // Assume 0 if empty
    } else if (isNaN(monthlyContributionValue) || monthlyContributionValue < 0) {
        document.getElementById('monthlyContributionError').textContent = 'Please enter a valid positive number';
        isValid = false;
    }

    if (isNaN(dividend) || dividend < 0 || dividend > 100) {
        document.getElementById('dividendError').textContent = 'Please enter a valid percentage between 0 and 100';
        isValid = false;
    }

    if (isNaN(period) || period < 1 || period > 200) {
        document.getElementById('periodError').textContent = 'Please enter a valid period between 1 and 200 years';
        isValid = false;
    }

    return isValid ? {
        initialInvestment: initialInvestmentValue,
        monthlyContribution: monthlyContributionValue,
        dividend,
        period
    } : false;
}

function calculateInvestment(initialInvestment, monthlyContribution, dividendRate, period) {
    let totalMonths = period * 12;
    let monthlyBalances = [];
    let dividends = [];
    let balance = initialInvestment;
    let yearlyData = [];
    let graphData = [];

    let totalDividendUpToYear = 0; // Track cumulative dividends for the graph

    for (let month = 1; month <= totalMonths; month++) {
        if (month === 1) {
            // First month of the first year
            monthlyBalances.push(balance);
            balance += monthlyContribution;
        } else if (month % 12 === 1) {
            // First month of the year after the first year
            balance = monthlyBalances[month - 2] + monthlyContribution;
            monthlyBalances.push(balance);
        } else if (month % 12 === 2 && month > 12) {
            // Second month of the year after the first year
            if (dividends.length >= 1) {
                balance = monthlyBalances[month - 2] + monthlyContribution + dividends[dividends.length - 1];
            } else {
                balance = monthlyBalances[month - 2] + monthlyContribution;
            }
            monthlyBalances.push(balance);
        } else {
            // Other months
            balance = monthlyBalances[month - 2] + monthlyContribution;
            monthlyBalances.push(balance);
        }

        // Calculate dividend at the end of each year
        if (month % 12 === 0) {
            let yearIndex = month / 12 - 1;
            let yearlyBalances = monthlyBalances.slice(yearIndex * 12, yearIndex * 12 + 12);
            let sumMinBalances = yearlyBalances.reduce((acc, val) => acc + val, 0);
            let averageMinBalance = sumMinBalances / 12;
            let yearlyDividend = averageMinBalance * (dividendRate / 100);
            dividends.push(yearlyDividend);

            // Update yearlyData
            let totalPrincipalUpToYear = initialInvestment + monthlyContribution * (month);
            yearlyData.push({
                year: yearIndex + 1,
                balance: balance,
                principal: totalPrincipalUpToYear,
                dividend: yearlyDividend
            });

            // Update graphData
            totalDividendUpToYear += yearlyDividend;
            let graphTotalValue = totalPrincipalUpToYear + totalDividendUpToYear;
            graphData.push({
                year: yearIndex + 1,
                totalValue: graphTotalValue,
                principal: totalPrincipalUpToYear,
                cumulativeDividend: totalDividendUpToYear
            });
        }
    }

    let totalDividend = dividends.reduce((acc, val) => acc + val, 0);
    let totalPrincipal = initialInvestment + monthlyContribution * totalMonths;
    let totalValue = initialInvestment + monthlyContribution * totalMonths + totalDividend;

    return {
        totalPrincipal,
        totalDividend,
        totalValue,
        yearlyData,
        graphData
    };
}

function updateChart(graphData) {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    const theme = document.documentElement.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#f7fafc' : '#2d3748';
    
    if (chart) {
        chart.destroy();
    }

    const formatToRM = (value) => {
        return new Intl.NumberFormat('ms-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: graphData.map(d => `${translations[currentLanguage].year} ${d.year}`), // Translate year label
            datasets: [
                {
                    label: translations[currentLanguage].datasetTotalValue, // Translate dataset label
                    data: graphData.map(d => d.totalValue),
                    borderColor: '#2b6cb0', // Blue
                    backgroundColor: 'rgba(43, 108, 176, 0.1)',
                    fill: true
                },
                {
                    label: translations[currentLanguage].datasetPrincipal, // Translate dataset label
                    data: graphData.map(d => d.principal),
                    borderColor: '#4a5568', // Gray
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: translations[currentLanguage].datasetDividend, // Translate dataset label
                    data: graphData.map(d => d.cumulativeDividend),
                    borderColor: '#38a169', // Green
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatToRM(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return formatToRM(value);
                        }
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    });
}

function populateTable(graphData) {
    const tbody = document.getElementById('investmentTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    graphData.forEach((data) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = data.year; // Year
        row.insertCell(1).textContent = data.principal.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Principal
        row.insertCell(2).textContent = data.cumulativeDividend.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Cumulative Dividend
        row.insertCell(3).textContent = data.totalValue.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Total Investment Value
    });
}

document.getElementById('toggleTable').addEventListener('click', function() {
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        this.textContent = translations[currentLanguage].showTableHide;
    } else {
        tableContainer.style.display = 'none';
        this.textContent = translations[currentLanguage].showTable;
    }
});

document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('initialInvestment').value = '';
    document.getElementById('monthlyContribution').value = '';
    document.getElementById('dividend').value = '';
    document.getElementById('period').value = '';
    
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    document.getElementById('totalPrincipal').textContent = 'RM 0.00';
    document.getElementById('totalInterest').textContent = 'RM 0.00';
    document.getElementById('totalValue').textContent = 'RM 0.00';
    
    if (chart) {
        chart.destroy();
        chart = null;
    }
    
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.style.display = 'none';
    
    const toggleTableButton = document.getElementById('toggleTable');
    toggleTableButton.textContent = translations[currentLanguage].showTable;
    
    const tbody = document.getElementById('investmentTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
});

document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const values = validateInputs();
    if (!values) return;

    const results = calculateInvestment(
        values.initialInvestment,
        values.monthlyContribution,
        values.dividend,
        values.period
    );

    document.getElementById('totalPrincipal').textContent = 
        `RM ${results.totalPrincipal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalInterest').textContent = 
        `RM ${results.totalDividend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalValue').textContent = 
        `RM ${results.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    updateChart(results.graphData);

    populateTable(results.graphData);

    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        document.getElementById('toggleTable').textContent = translations[currentLanguage].showTableHide;
    }
});