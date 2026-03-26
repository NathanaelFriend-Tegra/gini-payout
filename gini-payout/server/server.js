import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "http://192.168.68.107:8080",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb', type: 'application/json-patch+json' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 3001;
const MARKETPLACE_KEY_ID = process.env.OMNEA_MARKETPLACE_KEY_ID;

if (!process.env.OMNEA_BASE_URL) console.error("❌ Missing OMNEA_BASE_URL in .env");
if (!MARKETPLACE_KEY_ID) console.error("❌ Missing OMNEA_MARKETPLACE_KEY_ID in .env");

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// ── Registration ──────────────────────────────────────────────────────────────
app.get('/api/register/status', async (req, res) => {
  try {
    const { mobileNumber, version } = req.query;
    const url = `${process.env.OMNEA_BASE_URL}chips/register/status?mobileNumber=${encodeURIComponent(mobileNumber)}&version=${version || '1.0'}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'marketplaceKeyId': MARKETPLACE_KEY_ID },
    });
    const text = await resp.text();
    res.status(resp.status).json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/register/persons', async (req, res) => {
  try {
    const url = `${process.env.OMNEA_BASE_URL}chips/register/persons?version=1.0`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/register/mobile/otp', async (req, res) => {
  try {
    const { mobileNumber, version } = req.query;
    const url = `${process.env.OMNEA_BASE_URL}chips/register/mobile/otp?mobileNumber=${encodeURIComponent(mobileNumber)}&version=${version || '1.0'}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'marketplaceKeyId': MARKETPLACE_KEY_ID },
    });
    const text = await resp.text();
    res.status(resp.status).json(text ? JSON.parse(text) : { sent: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/register/mobile/otp', async (req, res) => {
  try {
    const { mobileNumber, version } = req.query;
    const url = `${process.env.OMNEA_BASE_URL}chips/register/mobile/otp?mobileNumber=${encodeURIComponent(mobileNumber)}&version=${version || '1.0'}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'marketplaceKeyId': MARKETPLACE_KEY_ID },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    res.status(resp.status).json(text ? JSON.parse(text) : { verified: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/pin', async (req, res) => {
  try {
    const url = `${process.env.OMNEA_BASE_URL}chips/auth/pin?version=1.0`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'marketplaceKeyId': MARKETPLACE_KEY_ID },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    res.status(resp.status).json(text ? JSON.parse(text) : { success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/auth/pin/otp — send OTP to reset or set a PIN
app.post('/api/auth/pin/otp', async (req, res) => {
  try {
    const { mobileNumber, emailAddress } = req.body;
    console.log('📱 PIN OTP request for:', mobileNumber);
    const url = `${process.env.OMNEA_BASE_URL}chips/auth/pin/otp`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
      body: JSON.stringify({ mobileNumber, emailAddress }),
    });
    const text = await resp.text();
    console.log('📥 PIN OTP status:', resp.status);
    try { res.status(resp.status).json(text ? JSON.parse(text) : { sent: true }); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/auth/pin', async (req, res) => {
  // ... your existing code unchanged
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { packageName, mobileNumber, pin } = req.body;
    console.log('🔐 Login attempt:', { mobileNumber });
    const url = `${process.env.OMNEA_BASE_URL}chips/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
      body: JSON.stringify({ packageName, mobileNumber, pin }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    console.log('✅ Login successful');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/refresh', async (req, res) => {
  try {
    const refreshToken = req.headers['authorization'];
    console.log('🔄 Refresh request, token preview:', refreshToken?.substring(0, 30) + '...');
    const url = `${process.env.OMNEA_BASE_URL}chips/auth/login/refresh?version=1.0`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (!response.ok) return res.status(response.status).json(data);
      console.log('✅ Refresh successful');
      res.json(data);
    } catch {
      res.status(500).json({ error: 'Invalid JSON from Omnea', raw: text });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Accounts ──────────────────────────────────────────────────────────────────
app.get('/api/accounts/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];
    const url = `${process.env.OMNEA_BASE_URL}chips/money/accounts/${uuid}?version=1.0`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
    });
    const text = await resp.text();
    console.log('📥 Account response status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
});

app.patch('/api/accounts/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];
    if (!authToken) return res.status(401).json({ error: 'Authorization token required' });
    const apiUrl = `${process.env.OMNEA_BASE_URL}chips/money/accounts/${uuid}`;
    const resp = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
});

// ── Transactions ──────────────────────────────────────────────────────────────
app.get("/api/transactions", async (req, res) => {
  try {
    const { accountUuid, version } = req.query;
    const authToken = req.headers['authorization'];
    if (!accountUuid) return res.status(400).json({ error: "accountUuid is required" });
    if (!authToken) return res.status(401).json({ error: "Authorization token required" });

    const url = new URL("chips/money/transactions", process.env.OMNEA_BASE_URL);
    url.searchParams.set("accountUuid", accountUuid);
    if (version) url.searchParams.set("version", version);

    console.log("📡 Fetching transactions:", url.toString());
    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        'Accept': "application/json",
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      }
    });
    const text = await resp.text();
    console.log('📥 Transactions response status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", detail: String(err) });
  }
});

// ── QR Payments ───────────────────────────────────────────────────────────────

// POST /api/payments/qr — look up QR token details (no auth needed)
app.post('/api/payments/qr', async (req, res) => {
  try {
    const { codeQR } = req.body;
    console.log('🔍 QR code lookup:', { codeQR });
    const url = `${process.env.OMNEA_BASE_URL}chips/money/payments/qr`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
      body: JSON.stringify({ codeQR }),
    });
    const text = await resp.text();
    console.log('📥 QR lookup status:', resp.status, text);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/payments/qr/pay — execute the QR payment
// The Omnea API requires the JWT both as Authorization header AND in the request body
app.post('/api/payments/qr/pay', async (req, res) => {
  try {
    const authToken = req.headers['authorization']; // raw JWT from client (no "Bearer " prefix)

    // The raw JWT goes in the body; Omnea needs "Bearer <jwt>" in the header
    const rawJwt = authToken?.replace(/^Bearer\s+/i, ''); // safe-strip in case prefix exists
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken; // always "Bearer <jwt>"

    console.log('💳 QR Pay request:', {
      amount: req.body.amount,
      payerAccountUuid: req.body.payerAccountUuid,
      payeeAccountUuid: req.body.payeeAccountUuid,
      requestId: req.body.requestId,
      tokenId: req.body.tokenId,
      jwtInjected: !!rawJwt,
    });

    const url = `${process.env.OMNEA_BASE_URL}chips/money/payments/qr/pay`;

    // Inject the raw jwt into the body — Omnea requires it both in the header AND body
    const bodyWithJwt = {
      ...req.body,
      jwt: rawJwt,
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,  // always "Bearer <jwt>" ✅
      },
      body: JSON.stringify(bodyWithJwt),
    });

    const text = await resp.text();
    console.log('📥 QR Pay response status:', resp.status);
    console.log('📥 QR Pay response body:', text);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ QR Pay error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// ── ATM Cash Send ─────────────────────────────────────────────────────────────
app.post('/api/chips/money/cashsends/atm', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const apiUrl = `${process.env.OMNEA_BASE_URL}chips/money/cashsends/atm`;
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    console.log('📥 ATM Cash Send status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── EFT ──────────────────────────────────────────────────────────────────────
app.get('/api/eft/funding/fees', async (req, res) => {
  try {
    const { amount, version } = req.query;
    const authToken = req.headers['authorization'];
    const url = `${process.env.OMNEA_BASE_URL}chips/money/eft/payments/paypump/deposit/fee?version=${version || '1.0'}&amount=${amount}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
    });
    const text = await resp.text();
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/eft/deposit', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const url = `${process.env.OMNEA_BASE_URL}chips/money/eft/payments/paypump/deposit`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    console.log('📥 Paypump deposit status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/eft/funding/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];
    const url = `${process.env.OMNEA_BASE_URL}chips/money/eft/funding/${uuid}?version=1.0`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
    });
    const text = await resp.text();
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── EFT Payment (bank transfer out) ──────────────────────────────────────────
app.post('/api/eft/payment', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    const {
      amount, payerAccountUuid, payerRefInfo, branchCode, accountName,
      accountNumber, bankRefInfo, bankCode, bankAccountType, bankPaymentMethodType
    } = req.body;

    console.log('🏦 EFT Payment Request:', { amount, accountNumber, bankCode, payerAccountUuid });

    const apiUrl = `${process.env.OMNEA_BASE_URL}chips/money/eft/payments`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
      body: JSON.stringify({
        amount, payerAccountUuid, payerRefInfo, branchCode,
        accountName, accountNumber, bankRefInfo, bankCode,
        bankAccountType, bankPaymentMethodType,
      }),
    });

    const text = await response.text();
    console.log('📥 EFT Payment status:', response.status, text.substring(0, 300));
    try { res.status(response.status).json(JSON.parse(text)); }
    catch { res.status(response.status).send(text); }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// ── Multi-Payment ─────────────────────────────────────────────────────────────
app.post('/api/payments/requests/multi', async (req, res) => {
  try {
    const url = `${process.env.OMNEA_BASE_URL}chips/money/payments/requests/multi?version=1.0`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/payments/purchases/multi-payments', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const url = `${process.env.OMNEA_BASE_URL}chips/money/payments/purchases/multi-payments`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': authToken,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// =============================================================================
// SAVINGS ROUTES — add these to server.js before app.listen()
// Base path: fintech/iaccount/savings (same host, different path from chips/money)
// =============================================================================

// GET /api/savings/profile/:accountUuid — get savings profile
app.get('/api/savings/profile/:accountUuid', async (req, res) => {
  try {
    const { accountUuid } = req.params;
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('💰 GET savings profile:', { accountUuid });

    const url = `${process.env.OMNEA_BASE_URL}fintech/iaccount/savings/profile/${accountUuid}?version=1.0`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
    });

    const text = await resp.text();
    console.log('📥 Savings profile status:', resp.status, text.substring(0, 200));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ Savings profile error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// PATCH /api/savings/profile/:accountUuid — enable/configure savings
app.patch('/api/savings/profile/:accountUuid', async (req, res) => {
  try {
    const { accountUuid } = req.params;
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('💰 PATCH savings profile:', { accountUuid, body: req.body });

    const url = `${process.env.OMNEA_BASE_URL}fintech/iaccount/savings/profile/${accountUuid}?version=1.0`;

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json-patch+json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
      body: JSON.stringify(req.body), // JSON Patch array
    });

    const text = await resp.text();
    console.log('📥 Savings patch status:', resp.status, text.substring(0, 200));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ Savings patch error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/savings/detail/:accountUuid — get savings detail
app.get('/api/savings/detail/:accountUuid', async (req, res) => {
  try {
    const { accountUuid } = req.params;
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('💰 GET savings detail:', { accountUuid });

    const url = `${process.env.OMNEA_BASE_URL}fintech/iaccount/savings/detail/${accountUuid}?version=1.0`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
    });

    const text = await resp.text();
    console.log('📥 Savings detail status:', resp.status, text.substring(0, 200));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ Savings detail error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// DELETE /api/savings/profile/:accountUuid/clear — delete/reset savings profile
app.delete('/api/savings/profile/:accountUuid/clear', async (req, res) => {
  try {
    const { accountUuid } = req.params;
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('💰 DELETE savings profile:', { accountUuid });

    const url = `${process.env.OMNEA_BASE_URL}fintech/iaccount/savings/profile/${accountUuid}/clear?version=1.0`;

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
    });

    const text = await resp.text();
    console.log('📥 Savings delete status:', resp.status);
    try { res.status(resp.status).json(text ? JSON.parse(text) : { success: true }); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ Savings delete error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// =============================================================================
// MOBILE PREPAID ROUTES — paste into server.js before app.listen()
// Base path: chips/money/prepaid/mobile
// =============================================================================

// GET /api/prepaid/mobile/merchants — list all mobile networks (no auth)
app.get('/api/prepaid/mobile/merchants', async (req, res) => {
  try {
    console.log('📱 GET mobile merchants');
    const url = `${process.env.OMNEA_BASE_URL}chips/money/prepaid/mobile/merchants?version=1.0`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
    });
    const text = await resp.text();
    console.log('📥 Mobile merchants status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/prepaid/mobile/products?merchantUuid=xxx — list products for a network (no auth)
app.get('/api/prepaid/mobile/products', async (req, res) => {
  try {
    const { merchantUuid } = req.query;
    if (!merchantUuid) return res.status(400).json({ error: 'merchantUuid is required' });

    console.log('📱 GET mobile products for merchant:', merchantUuid);
    const url = `${process.env.OMNEA_BASE_URL}chips/money/prepaid/mobile/products?version=1.0&merchantUuid=${merchantUuid}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
    });
    const text = await resp.text();
    console.log('📥 Mobile products status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/prepaid/mobile/products/:productUuid — get single product (no auth)
app.get('/api/prepaid/mobile/products/:productUuid', async (req, res) => {
  try {
    const { productUuid } = req.params;
    console.log('📱 GET mobile product:', productUuid);
    const url = `${process.env.OMNEA_BASE_URL}chips/money/prepaid/mobile/products/${productUuid}?version=1.0`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
      },
    });
    const text = await resp.text();
    console.log('📥 Mobile product status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── Send Funds (user to user) ─────────────────────────────────────────────────
app.post('/api/sendfunds', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('💸 Send Funds request:', {
      payerAccountUuid: req.body.payerAccountUuid,
      payeeAccountUuid: req.body.payeeAccountUuid,
      amount: req.body.amount,
    });

    const url = `${process.env.OMNEA_BASE_URL}chips/money/sendfunds`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
      body: JSON.stringify(req.body),
    });

    const text = await resp.text();
    console.log('📥 Send Funds status:', resp.status, text.substring(0, 300));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ Send Funds error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/prepaid/mobile/purchases — buy airtime/data (auth required)
app.post('/api/prepaid/mobile/purchases', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('📱 POST mobile purchase:', {
      productUuid: req.body.productUuid,
      itemNumber: req.body.itemNumber,
      amount: req.body.amount,
    });

    const url = `${process.env.OMNEA_BASE_URL}chips/money/prepaid/mobile/purchases?version=1.0`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
      body: JSON.stringify(req.body),
    });
    const text = await resp.text();
    console.log('📥 Mobile purchase status:', resp.status, text.substring(0, 300));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ Mobile purchase error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/prepaid/mobile/purchases/history?payerAccountUuid=xxx — purchase history (auth required)
app.get('/api/prepaid/mobile/purchases/history', async (req, res) => {
  try {
    const { payerAccountUuid } = req.query;
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    if (!payerAccountUuid) return res.status(400).json({ error: 'payerAccountUuid is required' });

    console.log('📱 GET mobile purchase history for:', payerAccountUuid);
    const url = `${process.env.OMNEA_BASE_URL}chips/money/prepaid/mobile/purchases?payerAccountUuid=${payerAccountUuid}&version=1.0`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
    });
    const text = await resp.text();
    console.log('📥 Mobile purchase history status:', resp.status);
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── EFT Instant Payments (Bills) ──────────────────────────────────────────────

// GET /api/eft/instantpayments/:uuid — get instant payment status by UUID
app.get('/api/eft/instantpayments/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('🧾 GET EFT instant payment:', uuid);

    const url = `${process.env.OMNEA_BASE_URL}chips/money/eft/instantpayments/${uuid}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
    });

    const text = await resp.text();
    console.log('📥 EFT instant payment GET status:', resp.status, text.substring(0, 300));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ EFT instant payment GET error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/eft/instantpayments — create a new instant payment (bill payment)
app.post('/api/eft/instantpayments', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const rawJwt = authToken?.replace(/^Bearer\s+/i, '');
    const bearerToken = rawJwt ? `Bearer ${rawJwt}` : authToken;

    console.log('🧾 POST EFT instant payment:', {
      amount: req.body.amount,
      payeeAccountUuid: req.body.payeeAccountUuid,
      tokenId: req.body.tokenId,
      requestId: req.body.requestId,
    });

    const url = `${process.env.OMNEA_BASE_URL}chips/money/eft/instantpayments`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': bearerToken,
      },
      body: JSON.stringify(req.body),
    });

    const text = await resp.text();
    console.log('📥 EFT instant payment POST status:', resp.status, text.substring(0, 300));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    console.error('❌ EFT instant payment POST error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`📋 Routes:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/register/status`);
  console.log(`   POST /api/register/persons`);
  console.log(`   GET  /api/register/mobile/otp`);
  console.log(`   POST /api/register/mobile/otp`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/pin`);
  console.log(`   GET  /api/auth/refresh`);
  console.log(`   GET  /api/accounts/:uuid`);
  console.log(`   PATCH /api/accounts/:uuid`);
  console.log(`   GET  /api/transactions`);
  console.log(`   POST /api/chips/money/cashsends/atm`);
  console.log(`   GET  /api/eft/funding/fees`);
  console.log(`   POST /api/eft/deposit`);
  console.log(`   GET  /api/eft/funding/:uuid`);
  console.log(`   POST /api/payments/qr`);
  console.log(`   POST /api/payments/qr/pay`);
  console.log(`   POST /api/payments/requests/multi`);
  console.log(`   POST /api/payments/purchases/multi-payments`);
  console.log(`   GET  /api/savings/profile/:accountUuid`);
  console.log(`   PATCH /api/savings/profile/:accountUuid`);
  console.log(`   GET  /api/savings/detail/:accountUuid`);
  console.log(`   DELETE /api/savings/profile/:accountUuid/clear`);
  console.log(`   POST /api/auth/pin/otp`);
  console.log(`   GET  /api/eft/instantpayments/:uuid`);
  console.log(`   POST /api/eft/instantpayments`);
});