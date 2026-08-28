const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// Pomocná funkce pro stažení a úpravu stránek
async function fetchAndSend(targetUrl, res) {
    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Odstranění blokování pro iframe
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');

        const contentType = response.headers.get('content-type');
        if (contentType) res.setHeader('Content-Type', contentType);

        const body = await response.text();
        res.send(body);
    } catch (error) {
        res.status(500).send('Chyba proxy: ' + error.message);
    }
}

// 1. Když někdo otevře hlavní adresu (root), pošleme přímo Google bez přesměrování
app.get('/', async (req, res) => {
    await fetchAndSend('https://www.google.com', res);
});

// 2. Samotná proxy pro ostatní stránky z FoxOS prohlížeče
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Chybí parametr URL');
    }
    await fetchAndSend(targetUrl, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`FoxOS Proxy běží na portu ${PORT}`);
});
