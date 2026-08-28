const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Chybí parametr URL');
    }

    try {
        // Použití vestavěného fetch (Node.js 18+ ho má nativně, nepotřebuje node-fetch)
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');

        const contentType = response.headers.get('content-type');
        if (contentType) res.setHeader('Content-Type', contentType);

        const body = await response.text();
        res.send(body);
    } catch (error) {
        res.status(500).send('Chyba proxy serveru: ' + error.message);
    }
});

// POZOR: Port musí být načten přes process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`FoxOS Proxy běží na portu ${PORT}`);
});
