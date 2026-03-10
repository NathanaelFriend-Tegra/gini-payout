// src/lib/api.ts

// ==============================================
// CONFIGURATION
// ==============================================

const OMNEA_BASE_URL = import.meta.env.VITE_OMNEA_BASE_URL || 'https://apim-sbox.omnea.co.za/sandbox/';
const MARKETPLACE_KEY_ID = import.meta.env.VITE_OMNEA_MARKETPLACE_KEY_ID || '';
const PACKAGE_NAME = 'co.omnea.ginipayout';

// ==============================================
// TOKEN MANAGEMENT
// ==============================================

const getAuthToken = (): string | null => {
  return localStorage.getItem('omnea_access_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('omnea_refresh_token');
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem('omnea_refresh_token', token);
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('omnea_access_token', token);
};

const getUserData = (): any => {
  const data = localStorage.getItem('omnea_user_data');
  return data ? JSON.parse(data) : null;
};

const setUserData = (userData: any): void => {
  localStorage.setItem('omnea_user_data', JSON.stringify(userData));
};

export const clearTokens = (): void => {
  localStorage.removeItem('omnea_access_token');
  localStorage.removeItem('omnea_user_data');
  localStorage.removeItem('omnea_refresh_token');
};

// ==============================================
// API CALL HELPER
// ==============================================

interface ApiCallOptions extends RequestInit {
  requiresAuth?: boolean;
  skipMarketplaceKey?: boolean;
}

async function apiCall<T>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<T> {
  const { requiresAuth = false, skipMarketplaceKey = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (!skipMarketplaceKey) {
    headers['marketplaceKeyId'] = MARKETPLACE_KEY_ID;
  }

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = token;
    } else {
      throw new Error('No authentication token found. Please login.');
    }
  }

  const finalHeaders = {
    ...headers,
    ...fetchOptions.headers,
  };

  const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
  const url = `${PROXY_URL}/api/${endpoint}`;

  console.log('API Call:', {
    method: fetchOptions.method || 'GET',
    url,
    hasAuth: !!headers['Authorization'],
  });

  const response = await fetch(url, {
    ...fetchOptions,
    headers: finalHeaders,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || data.error || data.description || 'API request failed';
    console.error('API Error:', data);
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==============================================
// TYPE DEFINITIONS
// ==============================================

export interface RegistrationStatusResponse {
  registered: boolean;
  accountUuid?: string;
  memberUuid?: string;
  custodianUuid?: string;
}

export interface CreateProfileRequest {
  displayName: string;
  email?: string;
  mobileNumber: string;
  photo?: string;
  identity: {
    identityNumber: string;
    firstNames: string;
    surname: string;
    genderType: 'MALE' | 'FEMALE' | 'OTHER';
    countryOfBirth: string;
    dateOfBirth: string; // YYYY-MM-DD
    photo?: string;
  };
}

export interface CreateProfileResponse {
  accountUuid: string;
  memberUuid: string;
  email?: string;
  custodianUuid: string;
  status: string;
}

export interface SendOTPResponse {
  sent: boolean;
  expiresAt?: string;
}

export interface VerifyOTPRequest {
  mobileNumber: string;
  otp: string;
}

export interface VerifyOTPResponse {
  verified: boolean;
  token?: string;
}

export interface LoginRequest {
  packageName: string;
  mobileNumber: string;
  pin: string;
}

export interface LoginResponse {
  jwttoken: string;
  jwtRefresh: string;
  memberData: {
    uuid: string;
    accountUuid: string;
    displayName: string;
    memberType: string;
  };
  apimStatus: {
    statusCode: number;
  };
}

export interface AccountDetailsResponse {
  uuid: string;
  memberUuid: string;
  custodianUuid: string;
  memberType: string;
  verificationType: string;
  verificationLevel: number;
  availableBalanceAmount: number;
  autoLimitAmount: number;
  availableLimitAmount: number;
  approveLimitAmount: number;
  created: string;
  lastModified: string;
}

// ── Paypump Deposit ───────────────────────────────────────────────────────────

export interface PaypumpDepositRequest {
  accountName: string;
  accountUuid: string;
  amount: number;
  merchantReference: string;
  statementReference: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerMobile: string;
  customerCountryCode: string;
  successRedirect: string;
  cancelRedirect: string;
  errorRedirect: string;
  capitecDirect?: boolean;
  bankDirect?: string;
  customerAddress1?: string;
  customerAddress2?: string;
  customerCity?: string;
  customerSuburb?: string;
  customerPostcode?: string;
}

export interface PaypumpDepositResponse {
  input: PaypumpDepositRequest;
  qrCode: string;
  redirect: string;
  shortlink: string;
  simulator: string;
  token: string;
}

// ── EFT ──────────────────────────────────────────────────────────────────────

export interface EftFeesResponse {
  externalAmount: number;
  internalAmount: number;
  vatAmount: number;
  totalAmount: number;
  apimStatus: {
    marketplaceCode: number;
    marketplaceMsg: string;
    providerCode: string;
    providerMsg: string;
    userMsg: string;
    statusCode: number;
    marketplaceId: string;
    marketplaceMocked: boolean;
  };
}

// ── ATM Cash Send ─────────────────────────────────────────────────────────────

export interface ATMCashSendRequest {
  requestId: string;
  payerRefInfo: string;
  payerAccountUuid: string;
  mobileNumber: string;
  amount: number;
  provider: 'ABSA' | 'NEDBANK';
}

export interface ATMCashSendResponse {
  referenceNumber?: string;
  transactionId?: string;
  pin?: string;
  expiresAt?: string;
  apimStatus?: {
    statusCode: number;
    userMsg: string;
    marketplaceMsg: string;
  };
}

// ── QR Code Payments ──────────────────────────────────────────────────────────

export interface ApimStatus {
  marketplaceCode: number;
  marketplaceMsg: string;
  providerCode: string;
  providerMsg: string;
  userMsg: string;
  statusCode: number;
  marketplaceId: string;
  marketplaceMocked: boolean;
}

// Shape returned by POST /payments/qr (token lookup) — matches real API response
export interface QrCodeResponse {
  requestId: string;
  tokenId: string;
  transactionId: string;
  systemRefInfo: string;
  amount: number;
  gratuityAmount?: number;
  description: string;
  feeSponsorType: string;    // e.g. "PAYEE"
  paymentType: string;       // e.g. "DEFAULT"
  payeeAccountUuid: string;
  payeeRefInfo: string;
  payeeSiteName: string;
  payeeSiteRefInfo: string;
  partialPayment: boolean;
  apimStatus: ApimStatus;
}

// Payload for POST /payments/qr/pay — matches the working cURL exactly
export interface QrPayRequest {
  feeSponsorType: string;       // from QR response
  paymentType: string;          // from QR response
  description: string;          // from QR response
  amount: number;
  gratuityAmount?: number;
  payeeAccountUuid: string;     // from QR response
  payeeRefInfo: string;         // from QR response
  payeeSiteName: string;        // from QR response
  siteName?: string;
  payeeDescription?: string;
  payerDescription?: string;
  payerAccountUuid: string;     // logged-in user's accountUuid
  payerRefInfo: string;
  requestId: string;            // from QR response
  tokenId: string;              // from QR response — required by API
  // Note: `jwt` is injected automatically by the proxy server — do NOT send it from the client
  payerCategory1?: string | number;
  payerCategory2?: string | number;
  payerCategory3?: string | number;
}

export interface QrPayResponse {
  uuid?: string;
  status?: string;
  requestId?: string;
  transactionId?: string;
  amount?: number;
  apimStatus: ApimStatus;
}

// ── Multi-Payment (Cart Checkout) ─────────────────────────────────────────────

export interface MultiPaymentItem {
  payeeAccountUuid: string;
  payeeRefInfo: string;
  payerCategory1: string;
  payerCategory2: string;
  payerCategory3: string;
  payerRefInfo: string;
  siteRefInfo: string;
  siteName: string;
  amount: number;
  gratuityAmount: number;
}

export interface MultiPayRequest {
  requestId: string;
  description: string;
  payerAccountUuid: string;
  payments: MultiPaymentItem[];
  noOfInstructions: number;
}

export interface MultiPaymentItemResult {
  payeeAccountUuid: string;
  payeeRefInfo: string;
  payerCategory1: string;
  payerCategory2: string;
  payerCategory3: string;
  payerRefInfo: string;
  siteRefInfo: string;
  siteName: string;
  amount: number;
  gratuityAmount: number;
  status: string;
  transactionId: string;
}

export interface MultiPayResponse {
  uuid: string;
  requestId: string;
  description: string;
  payerAccountUuid: string;
  payments: MultiPaymentItemResult[];
  noOfInstructions: number;
  status: string;
  created: string;
  apimStatus: ApimStatus;
}

// ── Account Limits (JSON Patch) ───────────────────────────────────────────────

export type JsonPatchOp = 'replace' | 'add' | 'remove';

export interface JsonPatchOperation {
  op: JsonPatchOp;
  path: string;
  value?: number | string | boolean;
}

export interface UpdateAccountLimitsResponse {
  uuid?: string;
  approveLimitAmount?: number;
  autoLimitAmount?: number;
  availableLimitAmount?: number;
  apimStatus?: {
    statusCode: number;
    userMsg: string;
    marketplaceMsg: string;
  };
}

// ── Transactions ──────────────────────────────────────────────────────────────

export interface OmneaTxn {
  uuid: string;
  created: string;
  createdBy?: string;
  lastModified?: string;
  requestId?: string;
  amount: number;
  gratuityAmount?: number;
  fees?: {
    externalAmount: number;
    internalAmount: number;
    vatAmount: number;
    totalAmount: number;
  };
  accountUuid?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  contraAccountUuid?: string;
  description?: string;
  facilityType?: string;
  message?: string;
  movementAmount?: number;
  providerCode?: string;
  serviceCode?: string;
  siteName?: string;
  transactionStatus?: string;
  transactionType?: string;
  transferUuid?: string;
  txRefInfo?: string;
  systemRefInfo?: string;
}

export interface TransactionHistoryResponse {
  values: OmneaTxn[];
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  transactions?: OmneaTxn[]; // fallback alias
}

// ── Savings ─────────────────────────────────────────────────────────────────────

export interface SavingsProfile {
  accountUuid: string;
  enabled: boolean;
  userSavingsBalance: number;          
  userMonthlySavingsIncrease: number;  
  apimStatus?: ApimStatus;
}

export interface SavingsDetail {
  accountUuid: string;
  availableBalance: number;       
  totalWalletBalance: number;
  monthToDate?: {
    cashbackReceived?: number;
    interestEstimate?: number;
  };
  apimStatus?: ApimStatus;
}

export interface SavingsPatchOperation {
  op: 'replace' | 'add' | 'remove';
  path: '/enabled' | '/userSavingsBalance' | '/userMonthlySavingsIncrease';
  value: boolean | number;
}


// ── MOBILE PREPAID ─────────────────────────────────────────────────────────────────────

export interface MobileMerchant {
  uuid: string;
  name: string;           // "CellC" | "MTN" | "TelkomMobile" | "Vodacom"
  merchantType: string;   // "MOBILE"
  created: string;
}

export interface MobileMerchantsResponse {
  values: MobileMerchant[];
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}

export interface MobileProduct {
  uuid: string;
  merchantUuid: string;
  productType: string;    
  productCode: string;
  description: string;
  amount: number;
  productStatus: string;  
  approvalStatus: string;
  requestId?: string;
  created?: string;
  reason?: string;
}

export interface MobileProductsResponse {
  values: MobileProduct[];
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}

export interface MobilePurchaseRequest {
  payerAccountUuid: string;
  payerCategory1: string;   // network name e.g. "Vodacom"
  payerCategory2: string;
  payerCategory3: string;
  payerRefInfo: string;     // e.g. "Prepaid"
  productUuid: string;
  itemNumber: string;       // recipient mobile number e.g. "+27744976384"
  amount: number;
}

export interface MobilePurchaseResponse {
  payerAccountUuid: string;
  payerCategory1: string;
  payerCategory2: string;
  payerCategory3: string;
  payerRefInfo: string;
  productUuid: string;
  itemNumber: string;
  amount: number;
}

export interface MobilePurchaseHistoryItem {
  uuid: string;
  created: string;
  payerAccountUuid: string;
  payerCategory1: string;
  payerCategory2: string;
  payerCategory3: string;
  payerRefInfo: string;
  productUuid: string;
  itemNumber: string;
  amount: number;
  requestId?: string;
}

export interface MobilePurchaseHistoryResponse {
  values: MobilePurchaseHistoryItem[];
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}


// ==============================================
// AUTHENTICATION & REGISTRATION APIs
// ==============================================

export const checkRegistrationStatus = async (
  mobileNumber: string
): Promise<RegistrationStatusResponse> => {
  return apiCall<RegistrationStatusResponse>(
    `register/status?mobileNumber=${encodeURIComponent(mobileNumber)}&version=1.0`,
    { method: 'GET', requiresAuth: false }
  );
};

export const createProfile = async (
  profileData: CreateProfileRequest
): Promise<CreateProfileResponse> => {
  return apiCall<CreateProfileResponse>(
    'register/persons?version=1.0',
    { method: 'POST', requiresAuth: false, body: JSON.stringify(profileData) }
  );
};

export const sendOTP = async (mobileNumber: string): Promise<SendOTPResponse> => {
  return apiCall<SendOTPResponse>(
    `register/mobile/otp?mobileNumber=${encodeURIComponent(mobileNumber)}&version=1.0`,
    { method: 'GET', requiresAuth: false }
  );
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
  return apiCall<VerifyOTPResponse>(
    `register/mobile/otp?mobileNumber=${encodeURIComponent(data.mobileNumber)}&version=1.0`,
    { method: 'POST', requiresAuth: false, body: JSON.stringify(data) }
  );
};

export const login = async (mobileNumber: string, pin: string): Promise<any> => {
  console.log('🔐 Step 1: Attempting login for:', mobileNumber);

  const loginData = await apiCall<LoginResponse>(
    'auth/login',
    {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify({ packageName: PACKAGE_NAME, mobileNumber, pin }),
    }
  );

  console.log('✅ Step 1 complete: Login successful');
  console.log('🔄 Step 2: Attempting token refresh...');

  const refreshData = await apiCall<any>(
    'auth/refresh',
    {
      method: 'GET',
      requiresAuth: false,
      skipMarketplaceKey: false,
      headers: { 'Authorization': loginData.jwtRefresh },
    }
  );

  console.log('✅ Step 2 complete: Refresh successful');

  const accessToken = refreshData.jwttoken ?? refreshData.token;
  console.log('💾 Step 3: Storing access token, length:', accessToken?.length);

  setAuthToken(accessToken);
  setUserData({
    accountUuid: loginData.memberData.accountUuid,
    memberUuid: loginData.memberData.uuid,
    displayName: loginData.memberData.displayName,
    mobileNumber,
    refreshToken: refreshData.jwtRefresh,
  });

  console.log('✅ Step 3 complete: User data stored');
  return refreshData;
};

export const getAccountDetails = async (accountUuid?: string): Promise<AccountDetailsResponse> => {
  const userData = getUserData();
  const uuid = accountUuid || userData?.accountUuid;
  if (!uuid) throw new Error('No account UUID available');
  return apiCall<AccountDetailsResponse>(
    `accounts/${uuid}?version=1.0`,
    { method: 'GET', requiresAuth: true }
  );
};

export const logout = (): void => {
  clearTokens();
  window.location.href = '/login';
};

export const getCurrentUser = (): any => {
  return getUserData();
};

// ==============================================
// TRANSACTION APIs
// ==============================================

export const getTransactionHistory = async (
  accountUuid: string
): Promise<TransactionHistoryResponse> => {
  return apiCall<TransactionHistoryResponse>(
    `transactions?accountUuid=${encodeURIComponent(accountUuid)}&version=1.0`,
    { method: 'GET', requiresAuth: true }
  );
};

// ==============================================
// ATM CASH SEND
// ==============================================

export const sendATMCash = async (
  data: ATMCashSendRequest
): Promise<ATMCashSendResponse> => {
  return apiCall<ATMCashSendResponse>(
    'chips/money/cashsends/atm',
    { method: 'POST', requiresAuth: true, body: JSON.stringify(data) }
  );
};

// ==============================================
// EFT FUNDING APIs
// ==============================================

export const getEftFees = async (amount: number): Promise<EftFeesResponse> => {
  return apiCall<EftFeesResponse>(
    `eft/funding/fees?amount=${amount}&version=1.0`,
    { method: 'GET', requiresAuth: true }
  );
};

export const createPaypumpDeposit = async (
  data: PaypumpDepositRequest
): Promise<PaypumpDepositResponse> => {
  return apiCall<PaypumpDepositResponse>(
    'eft/deposit',
    { method: 'POST', requiresAuth: true, body: JSON.stringify(data) }
  );
};

export const getEftTransactionDetails = async (
  uuid: string
): Promise<PaypumpDepositResponse> => {
  return apiCall<PaypumpDepositResponse>(
    `eft/funding/${uuid}?version=1.0`,
    { method: 'GET', requiresAuth: true }
  );
};

// ==============================================
// QR CODE PAYMENT APIs
// ==============================================

// POST /payments/qr — look up token details (no auth required)
export const getQrCode = async (codeQR: string): Promise<QrCodeResponse> => {
  return apiCall<QrCodeResponse>(
    'payments/qr',
    { method: 'POST', requiresAuth: false, body: JSON.stringify({ codeQR }) }
  );
};

// POST /payments/qr/pay — execute the payment (auth required)
// The proxy server automatically injects the `jwt` field into the request body
export const payQrCode = async (data: QrPayRequest): Promise<QrPayResponse> => {
  return apiCall<QrPayResponse>(
    'payments/qr/pay',   // ✅ corrected from 'payments/purchases'
    { method: 'POST', requiresAuth: true, body: JSON.stringify(data) }
  );
};

// ==============================================
// ACCOUNT LIMITS
// ==============================================

export const updateAccountLimits = async (
  accountUuid: string,
  patches: JsonPatchOperation[]
): Promise<UpdateAccountLimitsResponse> => {
  return apiCall<UpdateAccountLimitsResponse>(
    `accounts/${accountUuid}`,
    {
      method: 'PATCH',
      requiresAuth: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patches),
    }
  );
};


// ── Savings ─────────────────────────────────────────────────────────────

/** GET /savings/profile/:accountUuid — fetch current savings profile */
export const getSavingsProfile = async (
  accountUuid: string
): Promise<SavingsProfile> => {
  return apiCall<SavingsProfile>(
    `savings/profile/${accountUuid}`,
    { method: 'GET', requiresAuth: true }
  );
};

export const updateSavingsProfile = async (
  accountUuid: string,
  patches: SavingsPatchOperation[]
): Promise<SavingsProfile> => {
  return apiCall<SavingsProfile>(
    `savings/profile/${accountUuid}`,
    {
      method: 'PATCH',
      requiresAuth: true,
      headers: { 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(patches),
    }
  );
};

/** GET /savings/detail/:accountUuid — fetch live savings detail */
export const getSavingsDetail = async (
  accountUuid: string
): Promise<SavingsDetail> => {
  return apiCall<SavingsDetail>(
    `savings/detail/${accountUuid}`,
    { method: 'GET', requiresAuth: true }
  );
};

/** DELETE /savings/profile/:accountUuid/clear — reset/delete savings profile */
export const clearSavingsProfile = async (
  accountUuid: string
): Promise<void> => {
  return apiCall<void>(
    `savings/profile/${accountUuid}/clear`,
    { method: 'DELETE', requiresAuth: true }
  );
};


// ── API Functions ─────────────────────────────────────────────────────────────

/** GET /prepaid/mobile/merchants — list all mobile networks */
export const getMobileMerchants = async (): Promise<MobileMerchantsResponse> => {
  return apiCall<MobileMerchantsResponse>(
    'prepaid/mobile/merchants',
    { method: 'GET', requiresAuth: false }
  );
};

/** GET /prepaid/mobile/products?merchantUuid=xxx — list products for a network */
export const getMobileProducts = async (
  merchantUuid: string
): Promise<MobileProductsResponse> => {
  return apiCall<MobileProductsResponse>(
    `prepaid/mobile/products?merchantUuid=${encodeURIComponent(merchantUuid)}`,
    { method: 'GET', requiresAuth: false }
  );
};

/** GET /prepaid/mobile/products/:productUuid — get a single product */
export const getMobileProduct = async (
  productUuid: string
): Promise<MobileProduct> => {
  return apiCall<MobileProduct>(
    `prepaid/mobile/products/${productUuid}`,
    { method: 'GET', requiresAuth: false }
  );
};

/** POST /prepaid/mobile/purchases — buy airtime or data */
export const purchaseMobileProduct = async (
  data: MobilePurchaseRequest
): Promise<MobilePurchaseResponse> => {
  return apiCall<MobilePurchaseResponse>(
    'prepaid/mobile/purchases',
    { method: 'POST', requiresAuth: true, body: JSON.stringify(data) }
  );
};

/** GET /prepaid/mobile/purchases/history — get purchase history */
export const getMobilePurchaseHistory = async (
  payerAccountUuid: string
): Promise<MobilePurchaseHistoryResponse> => {
  return apiCall<MobilePurchaseHistoryResponse>(
    `prepaid/mobile/purchases/history?payerAccountUuid=${encodeURIComponent(payerAccountUuid)}`,
    { method: 'GET', requiresAuth: true }
  );
};