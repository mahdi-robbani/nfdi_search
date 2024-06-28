const SERVICE_TO_PROXY_URL = {
    straininfo: `http://localhost:3000/proxy/straininfo`,
    service2: `http://localhost:3000/proxy/service2`, // TODO: Change to new service
};

let currentPage = 1;
const resultsPerPage = 10;
let paginatedResults = [];
let totalHits = {};

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    const service = document.getElementById('service-select').value;
    if (query) {
        search(query, service);
    }
});

async function search(query, service) {
    let urls = {};

    if (service === 'all') {
        for (const [s, url] of Object.entries(SERVICE_TO_PROXY_URL)) {
            urls[s] = (`${url}/${encodeURIComponent(query)}`);
        }
    } else {
        urls[service] = (`${SERVICE_TO_PROXY_URL[service]}/${encodeURIComponent(query)}`);
    }

    try {
        let allResults = [];
        totalHits = {};
        for (const [s, url] of Object.entries(urls)) {
            const response = await fetch(url);
            const data = await response.json();
            const { results, count } = preprocessResults(data, s);
            allResults = allResults.concat(results);
            totalHits[s] = count;
        }
        paginateResults(allResults);
        displayResults();
    } catch (error) {
        console.error('Error fetching the results:', error);
    }
}

function preprocessResults(data, service) {
    let results = [];
    if (service === 'straininfo') {
        results = data.result.slice(12, 15).map(result => ({
            name: result.name,
            term: result.term,
            type: result.type,
            link: result.link,
            source: service
        }));
    } else if (service === 'service2') {
        // Example preprocessing for Service 2
        results = data.result.slice(0, 10).map(result => ({
            // TODO: replace with fields in the other service
            name: result.name,
            term: result.term,
            type: result.type,
            link: result.link,
            source: service
        }));
    }
    return { results, count: results.length };
}

function paginateResults(allResults) {
    paginatedResults = [];
    for (let i = 0; i < allResults.length; i += resultsPerPage) {
        paginatedResults.push(allResults.slice(i, i + resultsPerPage));
    }
    currentPage = 1;
}

function displayResults() {
    const resultsContainer = document.getElementById('results');
    const paginationContainer = document.getElementById('pagination');
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    // Display total hits
    for (const [service, count] of Object.entries(totalHits)) {
        const countElement = document.createElement('p');
        countElement.textContent = `${service}: ${count} hits`;
        resultsContainer.appendChild(countElement);
    }

    // Display paginated results
    if (paginatedResults.length > 0 && paginatedResults[currentPage - 1]) {
        paginatedResults[currentPage - 1].forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'card mb-3';
            resultElement.innerHTML = `
            <div class="card">
                <div class="card-header">
                    Source: ${result.source}
                </div>
                <div class="card-body">
                    <h5 class="card-title"><a href="${result.link}">${result.name}</a></h5>
                    <p class="card-text">Term:${result.term} Type:result.type}  </p>
                </div>
            </div>
            `;
            resultsContainer.appendChild(resultElement);
        });

        // Add pagination controls
        const totalPages = paginatedResults.length;

        if (currentPage > 1) {
            const firstButton = document.createElement('button');
            firstButton.className = 'btn btn-secondary me-2';
            firstButton.textContent = 'First';
            firstButton.addEventListener('click', () => {
                currentPage = 1;
                displayResults();
            });
            paginationContainer.appendChild(firstButton);

            const prevButton = document.createElement('button');
            prevButton.className = 'btn btn-secondary me-2';
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                currentPage--;
                displayResults();
            });
            paginationContainer.appendChild(prevButton);
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'} me-2`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayResults();
            });
            paginationContainer.appendChild(pageButton);
        }

        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.className = 'btn btn-secondary me-2';
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                currentPage++;
                displayResults();
            });
            paginationContainer.appendChild(nextButton);

            const lastButton = document.createElement('button');
            lastButton.className = 'btn btn-secondary';
            lastButton.textContent = 'Last';
            lastButton.addEventListener('click', () => {
                currentPage = totalPages;
                displayResults();
            });
            paginationContainer.appendChild(lastButton);
        }
    } else {
        resultsContainer.innerHTML = '<p>No results found</p>';
    }
}
