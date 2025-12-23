const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
const REMOTE = 'https://lb.yogurtthehor.se/api/v1';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/api/v1', async (req, res) => {
  try {
    const url = REMOTE + req.originalUrl.replace(/^\/api\/v1/, '');
    const method = req.method;
    const headers = { ...req.headers };
    delete headers.host;

    const opts = { method, headers };
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      opts.body = JSON.stringify(req.body);
    }

    const r = await fetch(url, opts);
    const text = await r.text();
    res.status(r.status);
    res.set('Content-Type', r.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: 'Proxy error', message: e.message });
  }
});

app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT} -> ${REMOTE}`));
