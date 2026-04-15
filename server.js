const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

function isIOSInApp(ua) {
    return /iPad|iPhone|iPod/i.test(ua) && /Instagram|FBAN|FBAV|FB_IAB|TikTok/i.test(ua);
}

// /go?url=https://your-destination.com
app.get('/go', (req, res) => {
    const { url } = req.query;
    if (!url || !/^https?:\/\//i.test(url))
        return res.status(400).send('Invalid url param.');

    const ua = req.headers['user-agent'] || '';

    if (isIOSInApp(ua)) {
        const safariUrl = url.replace(/^https?:\/\//, 'x-safari-https://');
        return res.redirect(302, safariUrl);
    }
    return res.redirect(302, url);
});

// Universal Link stub redirect
app.get('/r', (req, res) => {
    const { to } = req.query;
    if (!to) return res.status(400).send('Missing "to" param.');
    return res.redirect(302, to);
});

// Apple App Site Association (AASA) JSON
app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "7TQJC8MYL8.app.safari-escape-wine",
                    "paths": ["/r/*"]
                }
            ]
        }
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

if (require.main === module) {
    app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = app;
