import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEftFees, createPaypumpDeposit, PaypumpDepositResponse, getCurrentUser, PaypumpDepositRequest, EftFeesResponse } from "@/lib/api";
import { toast } from "sonner";

const DepositPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState<EftFeesResponse | null>(null);
  const [loadingFees, setLoadingFees] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [step, setStep] = useState<"amount" | "confirm">("amount");

  const handleCheckFees = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLoadingFees(true);
    try {
      const result = await getEftFees(numAmount);
      setFees(result);
      setStep("confirm");
    } catch (error: any) {
      toast.error(error.message || "Could not retrieve fees. Please try again.");
    } finally {
      setLoadingFees(false);
    }
  };

  const handleConfirmDeposit = async () => {
    const user = getCurrentUser();
    if (!user?.accountUuid) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoadingPayment(true);
    try {
      const depositData: PaypumpDepositRequest = {
        accountUuid: user.accountUuid,
        accountName: user.displayName,
        amount: parseFloat(amount),
        merchantReference: `deposit-${Date.now()}`,
        statementReference: "EFT2Wallet",
        customerName: user.displayName?.split(" ")[0] ?? "",
        customerSurname: user.displayName?.split(" ")[1] ?? "",
        customerEmail: user.email || "noreply@ginipayout.co.za",
        customerMobile: user.mobileNumber ?? "",
        customerCountryCode: "ZA",
        successRedirect: `${window.location.origin}/success`,
        cancelRedirect: `${window.location.origin}/cancel`,
        errorRedirect: `${window.location.origin}/error`,
        capitecDirect: false,
      };

      const result = await createPaypumpDeposit(depositData);
      toast.success("Redirecting to your bank...");
      window.location.href = result.redirect;
    } catch (error: any) {
      toast.error(error.message || "Could not initiate deposit. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold text-foreground">Deposit money</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {step === "amount"
            ? "Enter the amount you'd like to deposit via EFT from your bank."
            : "Review the fees before confirming your deposit."}
        </p>
      </div>

      {/* Scrollable content — pb-24 ensures content never hides behind fixed button */}
      <div className="px-6 flex-1 flex flex-col gap-6 pb-24">
        {step === "amount" ? (
          <>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Amount (ZAR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  R
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full border border-input rounded-xl pl-8 pr-4 py-3 text-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[100, 250, 500, 1000, 2000, 5000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(String(preset))}
                  className={`rounded-xl py-2 text-sm font-medium border transition-colors ${
                    amount === String(preset)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-input hover:border-primary"
                  }`}
                >
                  R{preset.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="bg-muted rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">How it works</p>
              <p className="text-xs text-muted-foreground">
                1. Enter your deposit amount and check the fees.
              </p>
              <p className="text-xs text-muted-foreground">
                2. You'll be redirected to your banking app to complete the EFT.
              </p>
              <p className="text-xs text-muted-foreground">
                3. Your wallet balance updates once the payment is confirmed.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">You receive</span>
                <span className="text-sm font-semibold text-foreground">
                  R{parseFloat(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">EFT fee (incl. VAT)</span>
                <span className="text-sm font-semibold text-foreground">
                  R{(fees?.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Total from your bank</span>
                <span className="text-base font-bold text-foreground">
                  R{(parseFloat(amount) + (fees?.totalAmount ?? 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700">
                You'll be redirected to your banking app or portal to complete this EFT payment.
                Return to the app once done to see your updated balance.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Fixed button — always 10px from bottom on every device */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-[10px] bg-background">
        {step === "amount" ? (
          <button
            onClick={handleCheckFees}
            disabled={loadingFees || !amount}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base disabled:opacity-60"
          >
            {loadingFees ? "Checking fees..." : "Check fees"}
          </button>
        ) : (
          <button
            onClick={handleConfirmDeposit}
            disabled={loadingPayment}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base disabled:opacity-60"
          >
            {loadingPayment ? "Redirecting..." : "Confirm & pay"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DepositPage;