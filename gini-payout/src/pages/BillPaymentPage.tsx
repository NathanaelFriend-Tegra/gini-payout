import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiniButton } from "@/components/ui/GiniButton";
import { createInstantPayment, getInstantPayment, getCurrentUser, CreateInstantPaymentRequest, InstantPaymentResponse } from "@/lib/api";
import { toast } from "sonner";

// ─── Step types ───────────────────────────────────────────────────────────────
type Step = "enter" | "confirm" | "processing";

const BillPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("enter");
  const [tokenId, setTokenId] = useState("");
  const [payeeAccountUuid, setPayeeAccountUuid] = useState("");
  const [payeeRefInfo, setPayeeRefInfo] = useState("");
  const [bankRefInfo, setBankRefInfo] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<InstantPaymentResponse | null>(null);

  // ─── Validation ─────────────────────────────────────────────────────────────
  const isEnterValid =
    tokenId.trim().length > 0 &&
    payeeAccountUuid.trim().length > 0 &&
    payeeRefInfo.trim().length > 0 &&
    bankRefInfo.trim().length > 0 &&
    parseFloat(amount) > 0;

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (!isEnterValid) return;
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!user?.accountUuid) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setStep("processing");
    setLoading(true);

    try {
      const payload: CreateInstantPaymentRequest = {
        requestId: crypto.randomUUID(),
        tokenId: tokenId.trim(),
        payeeAccountUuid: payeeAccountUuid.trim(),
        payeeRefInfo: payeeRefInfo.trim(),
        bankRefInfo: bankRefInfo.trim(),
        comment: comment.trim() || undefined,
        payerMobile: user.mobileNumber,
        redirectUrl: `${window.location.origin}/bills/result`,
        feeSponsorType: "NONE",
        amount: Math.round(parseFloat(amount) * 100), // convert to cents
        gratuityAmount: 0,
      };

      const result = await createInstantPayment(payload);
      setPayment(result);

      if (result.paymentUrl) {
        toast.success("Redirecting to your bank to complete payment…");
        // Small delay so the user sees the message before redirect
        setTimeout(() => {
          // Store the payment UUID so the result page can poll it on return
          sessionStorage.setItem("bill_payment_uuid", result.uuid);
          sessionStorage.setItem("bill_payment_amount", amount);
          window.location.href = result.paymentUrl;
        }, 1200);
      } else {
        // No paymentUrl — payment may have completed inline (sandbox behaviour)
        toast.success("Payment initiated successfully.");
        sessionStorage.setItem("bill_payment_uuid", result.uuid);
        navigate("/bills/result");
      }
    } catch (err: any) {
      console.error("❌ Bill payment error:", err);
      toast.error(err?.message || "Payment failed. Please try again.");
      setStep("confirm"); // let user retry
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "confirm") setStep("enter");
    else navigate(-1);
  };

  // ─── Formatted amount display ────────────────────────────────────────────────
  const formattedAmount = amount
    ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        parseFloat(amount) || 0
      )
    : "R0.00";

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 space-y-6 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pay a Bill</h1>
          <p className="text-xs text-muted-foreground">
            {step === "enter" && "Enter your token and payment details"}
            {step === "confirm" && "Review before confirming"}
            {step === "processing" && "Processing your payment…"}
          </p>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2">
        {(["enter", "confirm", "processing"] as Step[]).map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step === s
                  ? "bg-primary"
                  : i < ["enter", "confirm", "processing"].indexOf(step)
                  ? "bg-primary/40"
                  : "bg-muted"
              }`}
            />
          </React.Fragment>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 1 — ENTER DETAILS                                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {step === "enter" && (
        <div className="space-y-4">

          {/* Token ID */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Token Number <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="e.g. TKN-0012345"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
            <p className="text-xs text-muted-foreground">
              Found on your bill or statement
            </p>
          </div>

          {/* Payee Account UUID */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Payee Account UUID <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={payeeAccountUuid}
              onChange={(e) => setPayeeAccountUuid(e.target.value)}
              placeholder="e.g. a1b2c3d4-e5f6-..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {/* Payee Reference */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Payee Reference <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={payeeRefInfo}
              onChange={(e) => setPayeeRefInfo(e.target.value)}
              placeholder="e.g. INV-2024-001"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {/* Bank Reference */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Bank Statement Reference <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={bankRefInfo}
              onChange={(e) => setBankRefInfo(e.target.value)}
              placeholder="e.g. Bill payment Jan"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Amount (ZAR) <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                R
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
          </div>

          {/* Comment (optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Comment{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Electricity bill"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          <GiniButton
            variant="primary"
            onClick={handleContinue}
            disabled={!isEnterValid}
            className="w-full mt-2"
          >
            Continue
          </GiniButton>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 2 — CONFIRM                                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {step === "confirm" && (
        <div className="space-y-4">

          {/* Summary card */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">

            {/* Amount hero */}
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground mb-1">You are paying</p>
              <p className="text-4xl font-bold text-foreground tracking-tight">
                {formattedAmount}
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* Detail rows */}
            {[
              { label: "Token", value: tokenId },
              { label: "Payee Account", value: `${payeeAccountUuid.slice(0, 8)}…${payeeAccountUuid.slice(-4)}` },
              { label: "Payee Ref", value: payeeRefInfo },
              { label: "Bank Ref", value: bankRefInfo },
              ...(comment ? [{ label: "Comment", value: comment }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                <span className="text-sm font-medium text-foreground text-right break-all">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="flex gap-2.5 rounded-xl bg-muted/60 px-4 py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
              />
            </svg>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You'll be redirected to your bank to complete this payment securely.
              Do not close the browser tab until you return.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <GiniButton
              variant="secondary"
              onClick={handleBack}
              className="flex-1"
            >
              Edit
            </GiniButton>
            <GiniButton
              variant="primary"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1"
            >
              Pay {formattedAmount}
            </GiniButton>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STEP 3 — PROCESSING (redirect in progress)                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center">
          <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div>
            <p className="font-semibold text-foreground">Preparing your payment</p>
            <p className="text-sm text-muted-foreground mt-1">
              Redirecting to your bank securely…
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillPaymentPage;