// Mock data for development - will be replaced with real API calls

export interface PayoutToken {
  id: string;
  token: string;
  issuerDisplayName: string;
  amount: number;
  amountFormatted: string;
  currency: string;
  note?: string;
  status: 'issued' | 'claimed' | 'partially_used' | 'used' | 'expired' | 'cancelled';
  expiresAt: string;
  expiresAtFormatted: string;
}

export interface StoreCreditBalance {
  issuerId: string;
  issuerName: string;
  issuerLogo?: string;
  balance: number;
  balanceFormatted: string;
}

export interface WalletSummary {
  cashBalance: number;
  cashBalanceFormatted: string;
  storeCredits: StoreCreditBalance[];
  totalStoreCreditFormatted: string;
  currency: string;
  walletRef: string;
  status: 'active' | 'locked';
  accountUuid?: string;
}

export interface Transaction {
  id: string;
  direction: 'credit' | 'debit';
  type: 'payout_credit' | 'eft' | 'cash' | 'airtime' | 'data' | 'billpay' | 'voucher' | 'qrpay' | 'electricity' | 'fee' | 'reversal';
  amount: number;
  amountFormatted: string;
  status: 'pending' | 'success' | 'failed' | 'reversed';
  description: string;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  senderType: 'user' | 'support';
  message: string;
  createdAt: string;
}

// Mock payout for demo
export const mockPayout: PayoutToken = {
  id: '1',
  token: 'demo-token-123',
  issuerDisplayName: 'Acme Corporation',
  amount: 1500.00,
  amountFormatted: 'R1,500.00',
  currency: 'ZAR',
  note: 'December bonus payment',
  status: 'issued',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  expiresAtFormatted: '15 Jan 2026',
};

export const mockWalletSummary: WalletSummary = {
  cashBalance: 850.00,
  cashBalanceFormatted: 'R850.00',
  storeCredits: [
    {
      issuerId: 'pnp',
      issuerName: 'Pick n Pay',
      balance: 350.00,
      balanceFormatted: 'R350.00',
    },
    {
      issuerId: 'checkers',
      issuerName: 'Checkers',
      balance: 200.00,
      balanceFormatted: 'R200.00',
    },
    {
      issuerId: 'woolworths',
      issuerName: 'Woolworths',
      balance: 100.00,
      balanceFormatted: 'R100.00',
    },
  ],
  totalStoreCreditFormatted: 'R650.00',
  currency: 'ZAR',
  walletRef: 'GP-12345678',
  status: 'active',
  accountUuid: '4ff3aaf2-e7d1-46b7-beef-8b17f00be71c',
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    direction: 'credit',
    type: 'payout_credit',
    amount: 1500.00,
    amountFormatted: 'R1,500.00',
    status: 'success',
    description: 'Payout from Acme Corporation',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    direction: 'debit',
    type: 'airtime',
    amount: 50.00,
    amountFormatted: 'R50.00',
    status: 'success',
    description: 'Airtime - 0821234567',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    direction: 'debit',
    type: 'electricity',
    amount: 200.00,
    amountFormatted: 'R200.00',
    status: 'success',
    description: 'Prepaid electricity',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    direction: 'debit',
    type: 'eft',
    amount: 500.00,
    amountFormatted: 'R500.00',
    status: 'pending',
    description: 'EFT to FNB ****4521',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockSupportMessages: SupportMessage[] = [
  {
    id: '1',
    senderType: 'support',
    message: 'Welcome to GiniPayout Support! How can we help you today?',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

// Transaction type labels and icons
export const transactionTypeLabels: Record<Transaction['type'], string> = {
  payout_credit: 'Payout received',
  eft: 'Bank transfer',
  cash: 'Cash withdrawal',
  airtime: 'Airtime',
  data: 'Data bundle',
  billpay: 'Bill payment',
  voucher: 'Voucher payment',
  qrpay: 'QR payment',
  electricity: 'Electricity',
  fee: 'Fee',
  reversal: 'Reversal',
};
