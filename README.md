# Search service

The search service used to search through all NFDI services.

Currently the CORS policy set by the DSMZ hub API prevents accessing data so a express js proxy (`proxy.js`) is being used to bypass it.

The actual search page consists of `index.html`, `search.js` and `styles.css`. These can be moved to the `nfdi4microbiota_pages` repo and the `index.html` file can just inherit from the base template. The remaining files are required for the proxy and can be hosted separately.

# Additional services

The virjenDB search cannot be added right now since the search api isn't available, and each search result also doesn't have its own page that we can link to.
