================================ Goal Of GiniPayout ================================
GiniPayout is the Ricipient side App, of a refunding app, refunds will be sent via tokens and all APIs will be facilitated via Omnea. 
=== Key Features ===
[] User Registration & ID Verification
[] Refund Claiming Via Tokens - Vouchers
    () Vouchers are the only way to deposit money currently
    () iAccount to iAccount payments will come later
[] Withdraw methods such as:
    () CashSend
    () EFT To Bank Account
    () Voucher Claiming 
[] Support Pages
    () Email & Cellphone Support
    () FAQ Page - Helping users navigate and answer FAQs
[] Secure App
    () API Security Best Practices to be applied
    () 2 Factor OTP verification

================================ Integration Guide ================================

Integration with Gini takes place in 3 sections 

1. Add the Interface (lib/api.ts)
Define the request and response shapes in api.ts.
typescriptexport interface MyNewRequest {
  accountUuid: string;
  amount: number;
}

export interface MyNewResponse {
  result: string;
  apimStatus: ApimStatus; // always included in Omnea responses
}

2. Add the API Function (lib/api.ts)
Call apiCall<T>() with the proxy endpoint, method, and whether auth is required.

typescriptexport const myNewApiCall = async (data: MyNewRequest): Promise<MyNewResponse> =>
  apiCall<MyNewResponse>('your/endpoint', {
    method: 'POST',           // GET | POST
    requiresAuth: true,       // false for public endpoints (login, register)
    body: JSON.stringify(data),
  });

Common patterns:
typescript// GET with query params
export const getSomething = (id: string) =>
  apiCall<SomeResponse>(`resource/${id}?version=1.0`, { requiresAuth: true });

// POST with body
export const createSomething = (data: SomeRequest) =>
  apiCall<SomeResponse>('resource', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify(data),
  });

3. Add the Proxy Route (server/server.js)
Mirror the function in server.js, swapping the proxy path for the full Omnea URL.

javascriptapp.post('/api/your/endpoint', async (req, res) => {
  const authToken = req.headers['authorization'];
  const resp = await fetch(`${process.env.OMNEA_BASE_URL}chips/money/your/endpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'marketplaceKeyId': MARKETPLACE_KEY_ID,
      'Authorization': `Bearer ${authToken}`, // omit if not required
    },
    body: JSON.stringify(req.body),
  });
  const text = await resp.text();
  try { res.status(resp.status).json(JSON.parse(text)); }
  catch { res.status(resp.status).send(text); }
});

4. Use It in a Page (pages/page.tsx)
Import and call inside a try/catch. Navigate to the shared result pages on completion.
typescriptimport { myNewApiCall } from '@/lib/api';

const handleAction = async () => {
  try {
    const result = await myNewApiCall({ accountUuid: user.accountUuid, amount });
    navigate(`/success?message=Done!`);
  } catch (err: any) {
    toast.error(err.message || 'Something went wrong.');
    // or navigate(`/error?message=${err.message}`);
  }
};

Things to Watch
SituationWhat to doResponse field doesn't match your interfaceconsole.log the raw response and update the interface400 Bad RequestLog req.body in the proxy — a required field is likely missing or wrong format500 from OmneaTheir server error — share the apimStatus.marketplaceId with Omnea supportMobile numberAlways strip +27 and replace with 0 before sendingEmpty emailUse user.email || 'noreply@ginipayout.co.za' — Omnea rejects empty strings

================================ Member Responibilities ================================
=== Nathanael ===
[] User Authentication & Security
•	Registration with phone verification (Omnea OTPs)
•	JWT Token Authorisation and Refresh
•	Pin reset 
•	MFA OTP Verification

[] Wallet Management
•	Cash balance display
•	Real-time balance sync with Omnea
•	Transaction history with search/filters

[] Withdrawal Methods
•	EFT to bank account (1-2 days)
•	ATM cardless withdrawal (ABSA, Nedbank)
•	Transfer to Gini iAccount 

[] Payment Options
•	QR code payments
•	Prepaid electricity
•	Bill payments

[] Support System
•	FAQ section
•	Email/phone support integration

=== Logan ===

[] Additional Features
•	Transaction receipts (PDF)
•	Email/SMS/Push notifications – Can supplement with Firebase or similar, NTFY service.
•	Profile Settings

[] Frontend Security
 () Move JWTs from localStorage to httpOnly cookies
 () Remove all console.log calls that expose tokens, UUIDs, or amounts
 ()  Gate any remaining logs behind a isDev flag
 ()  Sanitise QR code payload fields before rendering (description, refInfo, siteName)
 ()  Add token expiry check before every API call — redirect to login if expired
 ()  Ensure all API errors show generic user messages, not raw API error strings
 () Confirm the user is authenticated before rendering any protected page
 ()  Clear all tokens and user data on logout (clearTokens())


=== Tebogo ===

[] Frontend, Testing and feedback 
•	Testing features
•   Github Management
•   Lovable Integration
•   Frontend Lovable Generation