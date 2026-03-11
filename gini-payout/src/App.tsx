import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from '@/contexts/AuthContext';

// Pages - Public
import LandingPage from "./pages/LandingPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterDetailsPage from "./pages/RegisterDetailsPage";
import RegisterOTPPage from "./pages/RegisterOTPPage";
import RegisterPinPage from "./pages/RegisterPinPage";
import ClaimPage from "./pages/ClaimPage";
import OnboardPage from "./pages/OnboardPage";
import OTPPage from "./pages/OTPPage";


// Pages - Protected
import HomePage from "./pages/HomePage";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawEFTPage from "./pages/WithdrawEFTPage";
import WithdrawCashPage from "./pages/WithdrawCashPage";
import WithdrawGiniPage from "./pages/WithdrawGiniPage";
import SpendPage from "./pages/SpendPage";
import SpendAirtimePage from "./pages/SpendAirtimePage";
import SpendElectricityPage from "./pages/SpendElectricityPage";
import TransactionsPage from "./pages/TransactionsPage";
import SupportPage from "./pages/SupportPage";
import SupportChatPage from "./pages/SupportChatPage";
import SettingsPage from "./pages/SettingsPage";
import BusinessProposalPage from "./pages/BusinessProposalPage";
import NotFound from "./pages/NotFound";
import FAQPage from "./pages/FaqPage";
import QRPayPage from "./pages/QRPayPage";
import CancelPage from "./pages/CancelPage";
import ErrorPage from "./pages/PaymentErrorPage";
import { Home } from "lucide-react";
import SuccessPage from "./pages/SuccessPage";
import AccountLimitsPage from "./pages/AccountsLimitPage";
import MultiPaymentForm from "./pages/MutliPaymentForm";
import SavingsPage from "./pages/SavingsPage";
import MobileDataPage from "./pages/MobileDataPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-center" richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes (no AppShell, no auth required) ── */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/otp" element={<RegisterOTPPage />} />
            <Route path="/register/details" element={<RegisterDetailsPage />} />
            <Route path="/register/pin" element={<RegisterPinPage />} />
            <Route path="/c/:token" element={<ClaimPage />} />
            <Route path="/onboard" element={<OnboardPage />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/landingPage" element={<LandingPage />} />
            {/* ── Protected Routes ── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/deposit" element={<DepositPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/withdraw/eft" element={<WithdrawEFTPage />} />
                <Route path="/withdraw/cash" element={<WithdrawCashPage />} />
                <Route path="/withdraw/gini" element={<WithdrawGiniPage />} />
                <Route path="/spend" element={<SpendPage />} />
                <Route path="/spend/airtime" element={<SpendAirtimePage />} />
                <Route path="/spend/electricity" element={<SpendElectricityPage />} />
                <Route path="/txns" element={<TransactionsPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/support/chat" element={<SupportChatPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/business" element={<BusinessProposalPage />} />
                <Route path="/support/faqs" element={<FAQPage />} />
                <Route path="/QRPay" element={<QRPayPage />} />
                <Route path="/Success" element={<SuccessPage />} />
                <Route path="/Cancel" element={<CancelPage />} />
                <Route path="/Error" element={<ErrorPage />} />
                <Route path="/EditAccount" element={<AccountLimitsPage />} />
                <Route path="/MultiPayment" element={<MultiPaymentForm />} />
                <Route path="/Savings" element={<SavingsPage />} />
                <Route path="/mobile" element={<MobileDataPage />} />
              </Route>
            </Route>

            {/* Redirect /index to home */}
            <Route path="/index" element={<Navigate to="/home" replace />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;