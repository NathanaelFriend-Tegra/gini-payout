// src/lib/api.ts

// ==============================================
// CONFIGURATION
// ==============================================

const OMNEA_BASE_URL = import.meta.env.VITE_OMNEA_BASE_URL || 'https://apim-sbox.omnea.co.za/sandbox/';
const MARKETPLACE_KEY_ID = import.meta.env.VITE_OMNEA_MARKETPLACE_KEY_ID || '';
const PACKAGE_NAME = 'co.omnea.ginipayout'; // Your app package name

// ==============================================
// TOKEN MANAGEMENT
// ==============================================

const getAuthToken = (): string | null => {
  return localStorage.getItem('omnea_access_token');
};

// Token management additions
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
  localStorage.removeItem('omnea_refresh_token')
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

  // Add marketplace key first
  if (!skipMarketplaceKey) {
    headers['marketplaceKeyId'] = MARKETPLACE_KEY_ID;
  }

  // Add auth token if required (BEFORE spreading custom headers so custom headers win)
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = token;
    } else {
      throw new Error('No authentication token found. Please login.');
    }
  }

  // Spread custom headers LAST so they override everything above
  const finalHeaders = {
    ...headers,
    ...fetchOptions.headers,  // ← custom headers always win
  };
  // Point all calls at your local proxy
  const OMNEA_BASE_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';

  // In apiCall, change the url line to:
  const url = `${OMNEA_BASE_URL}/api/${endpoint}`;

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
  photo?: string; // Base64 selfie
  identity: {
    identityNumber: string;
    firstNames: string;
    surname: string;
    genderType: 'MALE' | 'FEMALE' | 'OTHER';
    countryOfBirth: string;
    dateOfBirth: string; // Format: YYYY-MM-DD
    photo?: string; // Base64 ID card
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

// ── Paypump Deposit ──────────────────────────────────────────────────────

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

// ── EFT Payment Calculations ──────────────────────────────────────────────────────

export interface EftFeesResponse {
  externalAmount: number;  // fee charged to customer
  internalAmount: number;  // internal fee
  vatAmount: number;       // VAT on the fee
  totalAmount: number;     // total including fees + VAT
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

// ─── sendATMCash  ───────────

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

// ── QR Code Payments ──────────────────────────────────────────────────────

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

export interface QrCodeResponse {
  requestId: string;
  paymentType: string;
  feeSponsorType: string;
  payeeAccountUuid: string;
  payeeRefInfo: string;
  payeeSiteName: string;
  siteName: string;
  tokenId: string;
  description: string;
  amount: number;
  gratuityAmount: number;
  transactionId: string;
  apimStatus: ApimStatus;
}

export interface QrPayRequest {
  feeSponsorType: string;
  paymentType: string;
  description: string;
  amount: number;
  gratuityAmount: number;
  payeeAccountUuid: string;
  payeeRefInfo: string;
  payeeSiteName: string;
  siteName: string;
  payerAccountUuid: string;
  payerRefInfo: string;
  requestId: string;
  tokenId: string;
}

export interface QrPayResponse {
  uuid: string;
  created: string;
  createdBy: string;
  createdByChannelUuid: string;
  lastModified: string;
  modifiedBy: string;
  systemRefInfo: string;
  payeeAccountUuid: string;
  payeeRefInfo: string;
  payeeMessage: string;
  payeeSiteRefInfo: string;
  payeeCategory1: string;
  payeeCategory2: string;
  payeeCategory3: string;
  payeeSiteName: string;
  siteName: string;
  payerAccountUuid: string;
  payerRefInfo: string;
  payerCategory1: string;
  payerCategory2: string;
  payerCategory3: string;
  requestId: string;
  amount: number;
  gratuityAmount: number;
  paymentDate: string;
  description: string;
  feeSponsorType: string;
  paymentType: string;
  status: string;
  apimStatus: ApimStatus;
}

// ─── Add these to /src/lib/api.ts ────────────────────────────────────────────

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

// ==============================================
// AUTHENTICATION & REGISTRATION APIs
// ==============================================

/**
 * Check if a mobile number is already registered
 */
export const checkRegistrationStatus = async (
  mobileNumber: string
): Promise<RegistrationStatusResponse> => {
  return apiCall<RegistrationStatusResponse>(
    `register/status?mobileNumber=${encodeURIComponent(mobileNumber)}&version=1.0`,
    {
      method: 'GET',
      requiresAuth: false,
    }
  );
};

/**
 * Create a new user profile/registration
 */
export const createProfile = async (
  profileData: CreateProfileRequest
): Promise<CreateProfileResponse> => {
  return apiCall<CreateProfileResponse>(
    'register/persons?version=1.0',
    {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify(profileData),
    }
  );
};

/**
 * Send OTP to mobile number for verification
 */
export const sendOTP = async (mobileNumber: string): Promise<SendOTPResponse> => {
  return apiCall<SendOTPResponse>(
    `register/mobile/otp?mobileNumber=${encodeURIComponent(mobileNumber)}&version=1.0`,
    { method: 'GET', requiresAuth: false }
  );
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
  return apiCall<VerifyOTPResponse>(
    `register/mobile/otp?mobileNumber=${encodeURIComponent(data.mobileNumber)}&version=1.0`,
    { method: 'POST', requiresAuth: false, body: JSON.stringify(data) }
  );
};


// Rename existing Transaction → OmneaTxn to represent the raw API response
export interface OmneaTxn {
  id: string;
  amount: number;
  type: string;
  date: string;
  // optional fields the mapper already defensively handles:
  currency?: string;
  description?: string;
  merchant?: string;
  reference?: string;
  createdAt?: string;
  timestamp?: string;
}

export interface TransactionHistoryResponse {
  transactions: OmneaTxn[];
  total: number;
}

export const getTransactionHistory = async (
  accountUuid: string,
): Promise<TransactionHistoryResponse> => {
  return apiCall<TransactionHistoryResponse>(
    `transactions?accountUuid=${encodeURIComponent(accountUuid)}&version=1.0`,
    {
      method: 'GET',
      requiresAuth: true, // ← pulls stored JWT automatically
    }
  );
};

//Send cash API
export const sendATMCash = async (
  data: ATMCashSendRequest
): Promise<ATMCashSendResponse> => {
  return apiCall<ATMCashSendResponse>(
    'chips/money/cashsends/atm',   // ← matches new proxy route exactly
    {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(data),
    }
  );
};

//QR CODE PLACE HOLDER
export const getQrDetails = async (qrCode: string): Promise<any> => {
  return apiCall<any>(
    `payments/qr/${qrCode}?version=1.0`,
    {
      method: 'GET',
      requiresAuth: true,
    }
  );
};
/**
 * Login with mobile number and PIN
 */
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
      headers: {
        'Authorization': loginData.jwtRefresh,
      },
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

  console.log('✅ Step 3 complete: User data stored', {
    accountUuid: loginData.memberData.accountUuid,
    displayName: loginData.memberData.displayName,
  });

  return refreshData;
};


/**
 * Get account details for logged-in user
 */
export const getAccountDetails = async (accountUuid?: string): Promise<AccountDetailsResponse> => {
  const userData = getUserData();
  const uuid = accountUuid || userData?.accountUuid;

  if (!uuid) throw new Error('No account UUID available');

  return apiCall<AccountDetailsResponse>(
    `accounts/${uuid}?version=1.0`,
    {
      method: 'GET',
      requiresAuth: true,
    }
  );
};

/**
 * Logout user
 */
export const logout = (): void => {
  clearTokens();
  window.location.href = '/login';
};



/**
 * Get stored user data
 */
export const getCurrentUser = (): any => {
  return getUserData();
};


// ── EFT Funding API calls ──────────────────────────────────────────────────

// api.ts - make sure it looks like this
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
    {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(data),
    }
  );
};


export const getEftTransactionDetails = async (
  uuid: string
): Promise<PaypumpDepositResponse> => {
  return apiCall<PaypumpDepositResponse>(
    `eft/funding/${uuid}?version=1.0`,
    {
      method: 'GET',
      requiresAuth: true,
    }
  );
};

// ── QR Codde Payment API calls ──────────────────────────────────────────────────
export const getQrCode = async (codeQR: string): Promise<QrCodeResponse> => {
  return apiCall<QrCodeResponse>(
    'payments/qr',
    {
      method: 'POST',
      requiresAuth: false,
      body: JSON.stringify({ codeQR }),
    }
  );
};

export const payQrCode = async (data: QrPayRequest): Promise<QrPayResponse> => {
  return apiCall<QrPayResponse>(
    'payments/qr/pay',
    {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(data),
    }
  );
};

/**
 * Adjust account limits via JSON Patch
 * e.g. updateAccountLimits(uuid, [{ op: 'replace', path: '/approveLimitAmount', value: 500 }])
 */
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