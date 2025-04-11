document.addEventListener('DOMContentLoaded', function () {
    const stockSearchInput = document.getElementById('stockSearch');
    const stockResultsList = document.getElementById('stockResults');

    // Fetch the stock symbols from the API
    async function fetchStockTags() {
        try {
            const response = await fetch('/api/getStockTags');
            const stockTags = await response.json();
            return stockTags;
        } catch (error) {
            console.error('Error fetching stock tags:', error);
            return [];
        }
    }

    // Filter the stock tags based on the search query
    function filterStockTags(stockTags, query) {
        return stockTags.filter(tag => tag.toLowerCase().includes(query.toLowerCase()));
    }

    // Render the matching stock results
    function renderStockResults(stockTags) {
        stockResultsList.innerHTML = ''; // Clear previous results

        if (stockTags.length === 0) {
            stockResultsList.innerHTML = '<li class="list-group-item">No matching results found.</li>';
            return;
        }

        stockTags.forEach(tag => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                ${tag}
                <span class="badge bg-primary rounded-pill">${tag}</span>
            `;
            stockResultsList.appendChild(listItem);
        });
    }

    // Handle input events for dynamic search
    stockSearchInput.addEventListener('input', async function () {
        const query = stockSearchInput.value.trim();

        // If the search box is empty, show all stock tags
        if (query.length === 0) {
            const stockTags = await fetchStockTags();
            renderStockResults(stockTags); 
            return;
        }

        // Fetch stock tags and filter them based on the input
        const stockTags = await fetchStockTags();
        const matchingTags = filterStockTags(stockTags, query);

        // Render the filtered results
        renderStockResults(matchingTags);
    });

    // Show all stock tags on page load
    (async function showAllStocksOnLoad() {
        const stockTags = await fetchStockTags();
        renderStockResults(stockTags);
    })();
});
