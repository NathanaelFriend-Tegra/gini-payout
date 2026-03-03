import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// Allow multiple origins (dev server, Flutter web, production)
const allowedOrigins = [
  "http://localhost:8080",
  "http://192.168.68.107:8080",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 3001;
const MARKETPLACE_KEY_ID = process.env.OMNEA_MARKETPLACE_KEY_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;

// Startup checks
if (!process.env.OMNEA_BASE_URL) {
  console.error("❌ Missing OMNEA_BASE_URL in .env");
}
if (!MARKETPLACE_KEY_ID) {
  console.error("❌ Missing OMNEA_MARKETPLACE_KEY_ID in .env");
}

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// GET /api/register/status
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

    console.log('📝 Creating profile, body keys:', Object.keys(req.body));
    console.log('📝 Identity keys:', Object.keys(req.body.identity || {}));

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID
      },
      body: JSON.stringify(req.body),
    });

    const text = await resp.text();
    console.log('📥 Register response status:', resp.status);
    console.log('📥 Register response body:', text.substring(0, 300));

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/register/mobile/otp  (send OTP)
app.get('/api/register/mobile/otp', async (req, res) => {
  try {
    const { mobileNumber, version } = req.query;
    const url = `${process.env.OMNEA_BASE_URL}chips/register/mobile/otp?mobileNumber=${encodeURIComponent(mobileNumber)}&version=${version || '1.0'}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'marketplaceKeyId': MARKETPLACE_KEY_ID },
    });
    // Sandbox returns empty body, so handle gracefully
    const text = await resp.text();
    res.status(resp.status).json(text ? JSON.parse(text) : { sent: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/register/mobile/otp  (verify OTP)
app.post('/api/register/mobile/otp', async (req, res) => {
  try {
    const { mobileNumber, version } = req.query;
    const url = `${process.env.OMNEA_BASE_URL}chips/register/mobile/otp?mobileNumber=${encodeURIComponent(mobileNumber)}&version=${version || '1.0'}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'marketplaceKeyId': MARKETPLACE_KEY_ID },
      body: JSON.stringify(req.body),
    });
    // Sandbox returns empty body
    const text = await resp.text();
    res.status(resp.status).json(text ? JSON.parse(text) : { verified: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/auth/pin  (set PIN)
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

// GET /api/transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const { accountUuid, version } = req.query;
    const authToken = req.headers['authorization'];

    console.log('📋 Transactions request:', { accountUuid });
    console.log('🔑 Auth token present:', !!authToken);
    console.log('🔑 Token preview:', authToken?.substring(0, 30) + '...');

    if (!accountUuid) {
      return res.status(400).json({ error: "accountUuid is required" });
    }

    if (!authToken) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const url = new URL("chips/money/transactions", process.env.OMNEA_BASE_URL);
    url.searchParams.set("accountUuid", accountUuid);
    if (version) url.searchParams.set("version", version);

    console.log("📡 Fetching transactions:", url.toString());

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        'Accept': "application/json",
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`, // ← user's JWT from login
      }
    });

    const text = await resp.text();
    console.log('📥 Transactions response status:', resp.status);

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error("❌ Transactions error:", err);
    res.status(500).json({ error: "Proxy failed", detail: String(err) });
  }
});

// POST /api/payments/qr/pay
app.post('/api/payments/qr/pay', async (req, res) => {
  try {
    const {
      feeSponsorType,
      paymentType,
      description,
      amount,
      gratuityAmount,
      payeeAccountUuid,
      payeeRefInfo,
      payeeSiteName,
      siteName,
      payerAccountUuid,
      payerRefInfo,
      requestId,
      tokenId
    } = req.body;

    console.log('💳 Processing QR payment:', { amount, payerAccountUuid, payeeAccountUuid });

    const response = await fetch('https://tar-sbox.tlsag.net/money/payments/qr/pay', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': process.env.Authorization, // Or however you handle auth
        // Add other required headers if needed
      },
      body: JSON.stringify({
        feeSponsorType,
        paymentType,
        description,
        amount,
        gratuityAmount,
        payeeAccountUuid,
        payeeRefInfo,
        payeeSiteName,
        siteName,
        payerAccountUuid,
        payerRefInfo,
        requestId,
        tokenId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Payment API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Payment successful:', data);
    res.json(data);
  } catch (error) {
    console.error('Payment proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/accounts/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];

    console.log('👤 Account details request:', { uuid });

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

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ Account details error:', err);
    res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
});

// ─── Replace your existing app.post('/api/cashsend/atm', ...) with this ────────

app.post('/api/chips/money/cashsends/atm', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    const { requestId, payerRefInfo, payerAccountUuid, mobileNumber, amount, provider } = req.body;

    console.log('=== ATM Cash Send Request ===');
    console.log('Body:', { requestId, payerRefInfo, payerAccountUuid, mobileNumber, amount, provider });

    const apiUrl = `${process.env.OMNEA_BASE_URL}chips/money/cashsends/atm`;
    console.log('API URL:', apiUrl);

    const requestBody = { requestId, payerRefInfo, payerAccountUuid, mobileNumber, amount, provider };
    console.log('Request Body:', requestBody);

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response Status:', resp.status);
    const text = await resp.text();
    console.log('Response Body:', text.substring(0, 500));

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (error) {
    console.error('❌ ATM Cash Send Error:', error.message);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Add this route to your backend server
app.post('/api/eft/payment', async (req, res) => {
  try {
    const {
      amount,
      payerRefInfo,
      branchCode,
      accountName,
      accountNumber,
      bankRefInfo,
      bankCode,
      bankAccountType,
      bankPaymentMethodType
    } = req.body;

    console.log('=== EFT Payment Request ===');
    console.log('Body:', req.body);

    const apiUrl = `${process.env.OMNEA_BASE_URL}chips/money/eft/payments`;
    console.log('API URL:', apiUrl);

    const requestBody = {
      amount,
      payerAccountUuid: process.env.AccountUuid,
      payerRefInfo,
      branchCode,
      accountName,
      accountNumber,
      bankRefInfo,
      bankCode,
      bankAccountType,
      bankPaymentMethodType
    };
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': process.env.Authorization,
        'Content-Type': 'application/json',
        'marketplaceKeyId': process.env.OMNEA_MARKETPLACE_KEY_ID,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response Status:', response.status);

    const data = await response.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('API Error Response:', data);
      return res.status(response.status).json({
        error: data.message || data.error || 'EFT payment failed',
        details: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error('=== EFT Payment Error ===');
    console.error('Error Message:', error.message);

    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
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
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/refresh', async (req, res) => {
  try {
    const refreshToken = req.headers['authorization'];

    console.log('🔄 Refresh request received');
    console.log('🔑 Token preview:', refreshToken?.substring(0, 30) + '...');

    const url = `${process.env.OMNEA_BASE_URL}chips/auth/login/refresh?version=1.0`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${refreshToken}`, // ← add Bearer prefix
      },
    });

    console.log('📥 Omnea response status:', response.status);

    const text = await response.text();
    console.log('📥 Omnea raw response:', text.substring(0, 200));

    try {
      const data = JSON.parse(text);
      if (!response.ok) {
        console.error('❌ Omnea error response:', data);
        return res.status(response.status).json(data);
      }
      console.log('✅ Refresh successful, token preview:', data.jwttoken?.substring(0, 30) + '...');
      res.json(data);
    } catch {
      console.error('❌ Failed to parse Omnea response as JSON:', text);
      res.status(500).json({ error: 'Invalid JSON from Omnea', raw: text });
    }
  } catch (error) {
    console.error('❌ Refresh error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/eft/funding/fees
app.get('/api/eft/funding/fees', async (req, res) => {
  try {
    const { amount, version } = req.query;
    const authToken = req.headers['authorization'];

    console.log('💰 EFT fees request:', { amount });

    const url = `${process.env.OMNEA_BASE_URL}chips/money/eft/funding/fees?version=${version || '1.0'}&amount=${amount}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'marketplaceKeyId': MARKETPLACE_KEY_ID,
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const text = await resp.text();
    console.log('📥 EFT fees response status:', resp.status);
    console.log('💰 EFT fees raw response:', text); // ← add this
    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ EFT fees error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/eft/funding/deposit (paypump deposit)
app.post('/api/eft/deposit', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    console.log('💳 Paypump deposit request:', { amount: req.body.amount, accountUuid: req.body.accountUuid });

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
    console.log('📥 Paypump deposit response status:', resp.status);
    console.log('📥 Paypump deposit response body:', text.substring(0, 500));

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ Paypump deposit error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/eft/funding/:uuid  (get EFT transaction details)
app.get('/api/eft/funding/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];

    console.log('🔍 EFT transaction details request:', { uuid });

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
    console.log('📥 EFT transaction response status:', resp.status);
    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ EFT transaction details error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/payments/qr — retrieve QR code details
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
    console.log('📥 QR code response status:', resp.status);
    console.log('📥 QR code response body:', text);

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ QR code lookup error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/payments/qr/pay — pay via QR code
app.post('/api/payments/qr/pay', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    console.log('💳 QR payment request:', { amount: req.body.amount, payerAccountUuid: req.body.payerAccountUuid });

    const url = `${process.env.OMNEA_BASE_URL}chips/money/payments/qr/pay`;

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
    console.log('📥 QR payment response status:', resp.status);
    console.log('📥 QR payment response body:', text);

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ QR payment error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// PATCH /api/accounts/:uuid — adjust account limits
app.patch('/api/accounts/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const authToken = req.headers['authorization'];

    console.log('⚙️ Account limit update request:', { uuid, body: req.body });

    if (!authToken) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    // req.body should be a JSON Patch array:
    // [{ "op": "replace", "path": "/approveLimitAmount", "value": 500 }]
    const apiUrl = `${process.env.OMNEA_BASE_URL}chips/money/accounts/${uuid}`;
    console.log('📡 Patching account:', apiUrl);
    console.log('📦 Patch body:', JSON.stringify(req.body));

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

    console.log('📥 Account patch response status:', resp.status);
    const text = await resp.text();
    console.log('📥 Account patch response body:', text.substring(0, 500));

    try {
      res.status(resp.status).json(JSON.parse(text));
    } catch {
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('❌ Account patch error:', err.message);
    res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
});

app.post('/api/payments/requests/multi', async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
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
    console.log('📥 Payment request response:', resp.status, text.substring(0, 300));
    try { res.status(resp.status).json(JSON.parse(text)); }
    catch { res.status(resp.status).send(text); }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Start server
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
  console.log(`   GET  /api/transactions`);
  console.log(`   POST /api/chips/money/cashsend/atm`);
  console.log(`   POST /api/eft/payment`);
  console.log(`   POST /api/payments/qr/pay`);
  console.log(`   GET  /api/eft/funding/fees`);
  console.log(`   POST /api/eft/funding`);
  console.log(`   GET  /api/eft/funding/:uuid`);
  console.log(`   POST /api/payments/qr`);
  console.log(`   POST /api/payments/qr/pay`);
  console.log(`   POST /api/payments/requests/multi`);
  console.log(`   PATCH /api/accounts/:uuid`);
});