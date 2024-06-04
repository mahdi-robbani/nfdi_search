document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    const service = document.getElementById('service-select').value;
    if (query) {
        search(query, service);
    }
});

async function search(query, service) {
    let urls = [];
    if (service === 'all' || service === 'straininfo') {
        urls.push(`http://localhost:3000/proxy/straininfo/${encodeURIComponent(query)}`);
    }
    if (service === 'all' || service === 'service2') {
        urls.push(`http://localhost:3000/proxy/service2/${encodeURIComponent(query)}`);
    }

    try {
        let results = [];
        for (const url of urls) {
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);
            results = results.concat(preprocessResults(data, service));
            // console.log(results);
        }
        displayResults(results);
    } catch (error) {
        console.error('Error fetching the results:', error);
    }
}

function preprocessResults(data, service) {
    if (service === 'straininfo' || service === 'all') {
        return data.result.map(result => ({
            name: result.name,
            term: result.term,
            type: result.type,
            link: result.link,
            source: result.source
        }));
    } else if (service === 'service2' || service === 'all') {
        // Example preprocessing for Service 2
        return data.map(result => ({
            name: result.otherName,
            term: result.otherTerm,
            type: result.otherType,
            link: result.otherLink,
            source: result.otherSource
        }));
    }
    return [];
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    if (results.length > 0) {
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
