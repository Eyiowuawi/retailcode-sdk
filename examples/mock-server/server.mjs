import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// ── Fake data ──────────────────────────────────────────────────────────────
const CONFIG = {
  success: true,
  data: {
    name: 'Tolu Adeosun',
    subscribedAirtime: false,
    subscribedData: false,
    airtimethresholds: { '200': 'thresh_air_200', '500': 'thresh_air_500', '1000': 'thresh_air_1000' },
    airtimeMin: 100,
    airtimeMax: 5000,
    dataThresholds: { '100MB': 'thresh_data_100', '500MB': 'thresh_data_500', '1GB': 'thresh_data_1g' },
    dataPlans: [
      { productId: 'plan_1g',  allowance: '1GB',  price: 300  },
      { productId: 'plan_3g',  allowance: '3GB',  price: 750  },
      { productId: 'plan_5g',  allowance: '5GB',  price: 1200 },
      { productId: 'plan_10g', allowance: '10GB', price: 2000 },
    ],
    terms: 'By subscribing you agree to the Retailcode Auto Topup Terms of Service.\n\n1. Your account will be automatically recharged when balance falls below the set threshold.\n2. You can cancel at any time from the portal.\n3. Charges apply per the plan selected.',
  },
};

const routes = {
  // Config endpoint
  'GET /api/v1/auto-topup/public/config': (_req, res, _params) => {
    // Simulate 300ms network delay
    setTimeout(() => send(res, 200, CONFIG), 300);
  },

  // Airtime subscribe
  'POST /api/v1/auto-topup/public/subscribe/airtime': (req, res) => {
    readBody(req).then(body => {
      console.log('  [airtime subscribe]', body);
      setTimeout(() => send(res, 200, { success: true, message: 'Airtime subscription activated' }), 400);
    });
  },

  // Data subscribe
  'POST /api/v1/auto-topup/public/subscribe/data': (req, res) => {
    readBody(req).then(body => {
      console.log('  [data subscribe]', body);
      setTimeout(() => send(res, 200, { success: true, message: 'Data subscription activated' }), 400);
    });
  },
};

// ── Static file serving (for the web example page) ─────────────────────────
function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' }[ext] ?? 'text/plain';
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

// ── Server ─────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  // CORS — needed when the web page is served from the same origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  console.log(`${req.method} ${pathname}`);

  // API routes (prefix match so config/{msisdn} works)
  const routeKey = Object.keys(routes).find(k => {
    const [method, path] = k.split(' ');
    return req.method === method && pathname.startsWith(path);
  });

  if (routeKey) {
    routes[routeKey](req, res);
    return;
  }

  // Static files — serve examples/web/ at /
  if (req.method === 'GET') {
    const file = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    const full = path.join(__dirname, '../web', file);
    serveStatic(res, full);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\nMock server running at http://localhost:${PORT}`);
  console.log('Open http://localhost:3000 in your browser\n');
});

// ── Helpers ────────────────────────────────────────────────────────────────
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
}
