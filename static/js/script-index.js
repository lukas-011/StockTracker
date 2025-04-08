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

// implementation starts here

// Grab the track button from our html document
const trackBtn = document.getElementById("trackBtn");

// When the button is clicked by the use we want to track the stock
trackBtn.addEventListener('click', () => {
    // Grab the tag that the user entered into the text box
    const tagTb = document.getElementById("stockTicker")

    // Fetch the stock data based on tag in the text box
    fetchStockData(tagTb.value)
});