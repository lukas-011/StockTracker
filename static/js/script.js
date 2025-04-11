/*
This function changes the current price and color of the price
based on the tag parameter passed into it
*/
async function fetchStockData(tag) {
    try {
        // requesting stock data from the server
        const response = await fetch(`/api/getStockPrice?tag=${encodeURIComponent(tag)}`);

        // Checking network
        if (!response.ok) throw new Error('Network response was not ok');

        // If the network is ok, update the stock price from the data requested
        const stockData = await response.json();

        // Update the stock price element
        console.log(stockData)
        updateStockPriceFromAPI(stockData["price"]);

    } catch (error) {
        console.error('Error fetching stock data:', error);
    }


}

// update stock prices
function updateStockPriceFromAPI(newPrice) {

    // Grab the stock price element in our html document
    const stockPriceElement = document.getElementById('stockPrice');

    // Get old price from text content, strip the $ and convert to number
    const oldPrice = parseFloat(stockPriceElement.textContent.replace('$', ''));

    // If oldPrice isn't set to a number, then skip this
    if(!isNaN(oldPrice)){
        // Apply color changes based on new and old price
        updateStockColors(newPrice, oldPrice);
    }

    // Set the content inside
    stockPriceElement.value = `$${newPrice.toFixed(2)}`;
}


// Existing color update function remains the same

function updateStockColors(newPrice, oldPrice) {
    const currentPrice = parseFloat(oldPrice);
    const previousPrice = parseFloat(newPrice);
    const priceElement = document.getElementById('stockPrice')

    // Remove existing color
    priceElement.classList.remove('text-success', 'text-danger');

    // Add color
    if (currentPrice > previousPrice) {
        priceElement.classList.add('text-success');
    } else if (currentPrice < previousPrice) {
        priceElement.classList.add('text-danger');
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

// Initial setup
function initStockTracking() {
    // Fetch stock data
    fetchStockData();
}
// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initStockTracking);
