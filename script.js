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

    // Reset error messages
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
            labels: graphData.map(d => `Year ${d.year}`),
            datasets: [
                {
                    label: 'Total Investment Value',
                    data: graphData.map(d => d.totalValue),
                    borderColor: '#2b6cb0', // Blue
                    backgroundColor: 'rgba(43, 108, 176, 0.1)',
                    fill: true
                },
                {
                    label: 'Principal',
                    data: graphData.map(d => d.principal),
                    borderColor: '#4a5568', // Gray
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: 'Dividend',
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
        this.textContent = 'Hide Investment Details in Table';
    } else {
        tableContainer.style.display = 'none';
        this.textContent = 'Show Investment Details in Table';
    }
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

    document.getElementById('resetButton').addEventListener('click', function() {
        // Clear all input fields
        document.getElementById('initialInvestment').value = '';
        document.getElementById('monthlyContribution').value = '';
        document.getElementById('dividend').value = '';
        document.getElementById('period').value = '';
        
        // Reset error messages
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        
        // Reset results display
        document.getElementById('totalPrincipal').textContent = 'RM 0.00';
        document.getElementById('totalInterest').textContent = 'RM 0.00';
        document.getElementById('totalValue').textContent = 'RM 0.00';
        
        // Destroy the chart if it exists
        if (chart) {
            chart.destroy();
            chart = null; // Clear the chart variable
        }
        
        // Hide the table and reset the toggle button text
        document.getElementById('tableContainer').style.display = 'none';
        document.getElementById('toggleTable').textContent = 'Show Investment Details in Table';
        
        // Clear the table data
        const tbody = document.getElementById('investmentTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
    });

    document.getElementById('totalPrincipal').textContent = 
        `RM ${results.totalPrincipal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalInterest').textContent = 
        `RM ${results.totalDividend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalValue').textContent = 
        `RM ${results.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    updateChart(results.graphData);
    populateTable(results.graphData);
});