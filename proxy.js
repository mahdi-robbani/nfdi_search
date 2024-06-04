const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

const SERVICE_TO_URL = {
    "straininfo": "https://hub.dsmz.de/api/search",
    "service2": "https://example.com"
}

app.use(cors());

app.get('/proxy/:service/:query', (req, res) => {
    const service = req.params.service;
    const query = req.params.query;
    const apiUrl = `${SERVICE_TO_URL[service]}/${query}`;
    request(apiUrl).pipe(res);
});

app.listen(3000, () => {
    console.log('Proxy server running on port 3000');
});
