document.addEventListener('DOMContentLoaded', function () {
    async function fetchStockData() {
        // Grab all the rows for each stock
        const rows = document.querySelectorAll('#stockTable tr');

        // Iterate through all the rows
        for (const row of rows) {
            const symbol = row.getAttribute('data-symbol');
            const priceElement = row.querySelector('td span'); // Ensure this is correctly targeting the span

            // Check if we successfully found the price element
            if (!priceElement) {
                console.error(`Price element not found for ${symbol}`);
                continue; // Skip to the next row if priceElement is missing
            }

            try {
                // Make API call to the flask API
                const response = await fetch(`/api/getStockPrice?tag=${encodeURIComponent(symbol)}`);
                const data = await response.json();

                // Get the price field from the JSON
                const newPrice = data["price"];
                const oldPrice = priceElement.getAttribute('data-previous-price') || 0;

                // Update the price in the table
                priceElement.textContent = `$${newPrice.toFixed(2)}`;
                priceElement.setAttribute('data-previous-price', newPrice);

                // Call function to update the color of the price
                updateStockColors(newPrice, oldPrice, priceElement);

            } catch (error) {
                console.error(`Error fetching price for ${symbol}:`, error);
                priceElement.textContent = '[ error ]';
            }
        }
    }

    /*
    This function changes the color of the price based on the old price
    */
    function updateStockColors(newPrice, oldPrice, priceElement) {
        const currentPrice = parseFloat(oldPrice);
        const previousPrice = parseFloat(newPrice);

        // Remove existing color
        priceElement.classList.remove('text-success', 'text-danger');

        // Add color
        if (currentPrice <= previousPrice) {
            priceElement.classList.add('text-success');
        } else if (currentPrice > previousPrice) {
            priceElement.classList.add('text-danger');
        }
    }

    // Fetch stock data initially
    fetchStockData();

    // Set up periodic data refresh (every 10 seconds)
    setInterval(fetchStockData, 10000);
});

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
    
    // Set up periodic data refresh (every 10 seconds)
    setInterval(fetchStockData, 2000);
}
// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initStockTracking);

// Store historical data for the chart
let stockHistoryData = {};

// Initialize Chart.js line chart
let stockChart;
