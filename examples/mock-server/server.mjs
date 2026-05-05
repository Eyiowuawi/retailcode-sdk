import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// ── Real API target ────────────────────────────────────────────────────────
const API_TARGET = 'corporatedevapi.retailcode.com.ng';

// ── Static file serving ────────────────────────────────────────────────────
function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
  }[ext] ?? 'text/plain';
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

// ── Proxy a request to the real API ───────────────────────────────────────
function proxyToApi(req, res) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_TARGET,
      port:     443,
      path:     req.url,
      method:   req.method,
      headers: {
        ...req.headers,
        host: API_TARGET,   // override host so the real server accepts it
      },
    };

    console.log(`  → proxy ${req.method} https://${API_TARGET}${req.url}`);

    const proxy = https.request(options, (apiRes) => {
      // Pass CORS headers back to the browser
      res.writeHead(apiRes.statusCode, {
        ...apiRes.headers,
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      apiRes.pipe(res, { end: true });
      resolve();
    });

    proxy.on('error', (err) => {
      console.error('  proxy error:', err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ success: false, message: 'Proxy error: ' + err.message }));
      reject(err);
    });

    // Forward the request body (for POST calls)
    req.pipe(proxy, { end: true });
  });
}

// ── Server ─────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;
  console.log(`${req.method} ${pathname}`);

  // Proxy all /api/* calls to the real server
  if (pathname.startsWith('/api/')) {
    await proxyToApi(req, res);
    return;
  }

  // Serve static files (examples/web/) for everything else
  if (req.method === 'GET') {
    const file = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    serveStatic(res, path.join(__dirname, '../web', file));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\nProxy server running at http://localhost:${PORT}`);
  console.log(`Forwarding API calls → https://${API_TARGET}`);
  console.log('Open http://localhost:3000 in your browser\n');
});
