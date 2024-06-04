document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
        search(query);
    }
});

async function search(query) {
    const url = `http://localhost:3000/proxy/${encodeURIComponent(query)}`; // Proxy server URL
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.result);
    } catch (error) {
        console.error('Error fetching the results:', error);
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    if (results && results.length > 0) {
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'card mb-3';
            resultElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${result.name}</h5>
                    <p class="card-text">${result.term} (${result.type})</p>
                    <p class="card-text"><small class="text-muted">Source: ${result.source}</small></p>
                    <a href="${result.link}" class="btn btn-primary" target="_blank">Go to Link</a>
                </div>
            `;
            resultsContainer.appendChild(resultElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found</p>';
    }
}
