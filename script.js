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
    const stockPrices = document.querySelectorAll('#stockTable span');
    
    stockPrices.forEach((priceElement, index) => {
        // API returns array of stock objects
        if (stockData[index]) {
            const previousPrice = parseFloat(priceElement.dataset.previousPrice);
            const newPrice = stockData[index].price;

            // Update price and previous price
            priceElement.dataset.previousPrice = previousPrice.toFixed(2);
            priceElement.textContent = newPrice.toFixed(2);
        }
    });

    // Reapply color changes
    updateStockColors();
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