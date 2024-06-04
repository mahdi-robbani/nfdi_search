const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/proxy/:query', (req, res) => {
    const query = req.params.query;
    const apiUrl = `https://hub.dsmz.de/api/search/${query}`;
    request(apiUrl).pipe(res);
});

app.listen(3000, () => {
    console.log('Proxy server running on port 3000');
});
