const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Povolení přístupu pro tvůj webový FoxOS
app.use(cors());

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Chybí parametr URL');
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Vymazání blokovacích zámků
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server běží na portu ${PORT}`));
