const express = require('express');
const path = require('node:path');
const app = express();
const PORT = process.env.PORT || 3000;

function successPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Success</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #0f1115;
            color: #f5f7fb;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        main {
            width: min(92vw, 420px);
            padding: 32px 28px;
            border: 1px solid #262b35;
            border-radius: 20px;
            background: linear-gradient(180deg, #151922 0%, #10131a 100%);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
            text-align: center;
        }

        .mark {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(16, 185, 129, 0.12);
            color: #34d399;
            font-size: 30px;
        }

        h1 {
            margin: 0 0 10px;
            font-size: 28px;
        }

        p {
            margin: 0;
            color: #9aa4b2;
            line-height: 1.6;
            font-size: 15px;
        }

        a {
            display: inline-block;
            margin-top: 22px;
            padding: 12px 18px;
            border-radius: 999px;
            background: #2563eb;
            color: #fff;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <main>
        <div class="mark">✓</div>
        <h1>Success</h1>
        <p>The destination opened correctly.</p>
        <a href="/">Back to Browser Escape</a>
    </main>
</body>
</html>`;
}

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

app.get('/success', (_req, res) => {
    res.type('html').send(successPage());
});

// Apple App Site Association (AASA) JSON
app.get('/.well-known/apple-app-site-association', (_req, res) => {
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

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

if (require.main === module) {
    app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = app;
