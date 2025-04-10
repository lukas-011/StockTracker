// Fetch api
async function fetchStockData() {
    try {
        // Replace with actual api endpoint
        const response = await fetch('https://ourapi.com/stonks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        //Checking network
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const stockData = await response.json();
        updateStocksFromAPI(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

// update stock prices
function updateStocksFromAPI(stockData) {
    const rows = document.querySelectorAll('#stockTable tbody tr');
    // gets info by row
    rows.forEach(row => {
        const symbol = row.dataset.symbol;
        if (stockData[symbol]) {
            const priceElement = row.querySelector('span');
            if (priceElement) {
                const previousPrice = parseFloat(priceElement.dataset.previousPrice) || 0;
                const newPrice = stockData[symbol].price;

                priceElement.dataset.previousPrice = previousPrice.toFixed(2);
                priceElement.textContent = newPrice.toFixed(2);

                priceElement.classList.remove('price-up', 'price-down');
                if (newPrice > previousPrice) {
                    priceElement.classList.add('price-up');
                } else if (newPrice < previousPrice) {
                    priceElement.classList.add('price-down');
                }
            }
        }
    })
}
// POST request example for updating stocks
async function updateStockPrice(stockSymbol, newPrice) {
    try {
        const response = await fetch('https://ourapi.com/stonks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication if needed
            },
            body: JSON.stringify({
                symbol: stockSymbol,
                price: newPrice
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update stock price');
        }

        const result = await response.json();
        console.log('Stock update response:', result);
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

// Initial setup
function initStockTracking() {
    // Fetch stock data
    fetchStockData();
}
// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initStockTracking);

// Existing color update function remains the same
function updateStockColors() {
    const stockPrices = document.querySelectorAll('#stockTable span');
    
    stockPrices.forEach(priceElement => {
        const currentPrice = parseFloat(priceElement.textContent);
        const previousPrice = parseFloat(priceElement.dataset.previousPrice);

        // Remove existing color
        priceElement.classList.remove('price-up', 'price-down');

        // Add color
        if (currentPrice > previousPrice) {
            priceElement.classList.add('price-up');
        } else if (currentPrice < previousPrice) {
            priceElement.classList.add('price-down');
        }
    });
};
// POST request example for updating stocks
async function updateStockPrice(stockSymbol, newPrice) {
    try {
        const response = await fetch('https://ourapi.com/stonks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication if needed
            },
            body: JSON.stringify({
                symbol: stockSymbol,
                price: newPrice
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update stock price');
        }

        const result = await response.json();
        console.log('Stock update response:', result);
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

// Store historical data for the chart
let stockHistoryData = {};

// Initialize Chart.js line chart
let stockChart;

function initStockChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Default empty data structure
    const chartData = {
        labels: [],
        datasets: []
    };
    
    stockChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Stock Price ($)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

// Function to update the chart with new data
function updateStockChart(stockData) {
    // Current timestamp for the x-axis
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    // Get symbols from the table
    const symbols = Array.from(document.querySelectorAll('#stockTable tbody tr'))
        .map(row => row.dataset.symbol);
    
    // Initialize stockHistoryData for each symbol if not already done
    symbols.forEach(symbol => {
        if (!stockHistoryData[symbol]) {
            stockHistoryData[symbol] = {
                prices: [],
                times: []
            };
        }
        
        // Add new data point if available
        if (stockData[symbol]) {
            // Keep only the most recent 20 data points
            if (stockHistoryData[symbol].times.length >= 20) {
                stockHistoryData[symbol].times.shift();
                stockHistoryData[symbol].prices.shift();
            }
            
            stockHistoryData[symbol].times.push(timeLabel);
            stockHistoryData[symbol].prices.push(stockData[symbol].price);
        }
    });
    
    // Prepare datasets for Chart.js
    const datasets = symbols.map((symbol, index) => {
        // Generate a color based on index
        const hue = (index * 137) % 360;
        
        return {
            label: symbol,
            data: stockHistoryData[symbol].prices,
            borderColor: `hsl(${hue}, 70%, 50%)`,
            backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)`,
            tension: 0.3,
            borderWidth: 2
        };
    });
    
    // Get the latest set of time labels (should be the same for all symbols)
    const latestTimeLabels = symbols.length > 0 && stockHistoryData[symbols[0]] 
        ? stockHistoryData[symbols[0]].times 
        : [];
    
    // Update chart data
    stockChart.data.labels = latestTimeLabels;
    stockChart.data.datasets = datasets;
    stockChart.update();
}

// Initial setup
function initStockTracking() {
    // Initialize the chart
    initStockChart();
    
    // Fetch stock data
    fetchStockData();
    
    // Set up periodic data refresh (every 30 seconds)
    setInterval(fetchStockData, 30000);
}

// Call init when page loads
document.addEventListener('DOMContentLoaded', initStockTracking);

// Existing color update function remains the same
function updateStockColors() {
    const stockPrices = document.querySelectorAll('#stockTable span');
    
    stockPrices.forEach(priceElement => {
        const currentPrice = parseFloat(priceElement.textContent);
        const previousPrice = parseFloat(priceElement.dataset.previousPrice);

        // Remove existing color
        priceElement.classList.remove('price-up', 'price-down');

        // Add color
        if (currentPrice > previousPrice) {
            priceElement.classList.add('price-up');
        } else if (currentPrice < previousPrice) {
            priceElement.classList.add('price-down');
        }
    });
}