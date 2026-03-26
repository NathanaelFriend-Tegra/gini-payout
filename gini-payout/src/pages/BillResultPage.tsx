import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GiniButton } from "@/components/ui/GiniButton";
import { getInstantPayment, InstantPaymentResponse } from "@/lib/api";
import { toast } from "sonner";

type ResultState = "polling" | "success" | "failed" | "cancelled" | "unknown";

const MAX_POLLS = 10;
const POLL_INTERVAL_MS = 2500;

const BillResultPage: React.FC = () => {
  const navigate = useNavigate();

  const [resultState, setResultState] = useState<ResultState>("polling");
  const [payment, setPayment] = useState<InstantPaymentResponse | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Retrieve what was stored before the redirect
  const paymentUuid = sessionStorage.getItem("bill_payment_uuid");
  const paymentAmount = sessionStorage.getItem("bill_payment_amount");

  const formattedAmount = paymentAmount
    ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        parseFloat(paymentAmount) || 0
      )
    : "";

  // ─── Poll for status ────────────────────────────────────────────────────────
  const pollStatus = useCallback(async () => {
    if (!paymentUuid) {
      setResultState("unknown");
      return;
    }

    try {
      const result = await getInstantPayment(paymentUuid);
      setPayment(result);

      const status = result.status?.toUpperCase();

      if (status === "COMPLETE") {
        setResultState("success");
        sessionStorage.removeItem("bill_payment_uuid");
        sessionStorage.removeItem("bill_payment_amount");
        return "done";
      }

      if (status === "CANCELLED") {
        setResultState("cancelled");
        return "done";
      }

      if (status === "FAILED") {
        setResultState("failed");
        setErrorMessage(result.apimStatus?.userMsg || "Payment failed.");
        return "done";
      }

      // Still pending — keep polling
      return "pending";
    } catch (err: any) {
      console.error("❌ Poll error:", err);
      setErrorMessage(err?.message || "Could not retrieve payment status.");
      setResultState("unknown");
      return "done";
    }
  }, [paymentUuid]);

  // ─── Polling loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!paymentUuid) {
      setResultState("unknown");
      return;
    }

    let cancelled = false;
    let count = 0;

    const run = async () => {
      while (!cancelled && count < MAX_POLLS) {
        const outcome = await pollStatus();
        count++;
        setPollCount(count);

        if (outcome === "done") break;

        if (count < MAX_POLLS) {
          await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
        }
      }

      // Exhausted all polls without a terminal status
      if (!cancelled && count >= MAX_POLLS) {
        setResultState("unknown");
        toast.warning("Payment status is taking longer than expected. Check your history.");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pollStatus, paymentUuid]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  const SuccessIcon = () => (
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  const FailIcon = () => (
    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );

  const CancelIcon = () => (
    <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-yellow-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
        />
      </svg>
    </div>
  );

  const UnknownIcon = () => (
    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 18h.01"
        />
      </svg>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 max-w-md mx-auto">

      {/* ── Polling state ── */}
      {resultState === "polling" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div>
            <p className="font-semibold text-foreground text-lg">Verifying payment</p>
            <p className="text-sm text-muted-foreground mt-1">
              Checking with your bank… ({pollCount}/{MAX_POLLS})
            </p>
          </div>
        </div>
      )}

      {/* ── Success state ── */}
      {resultState === "success" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 pt-8">
            <SuccessIcon />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Successful</h1>
              {formattedAmount && (
                <p className="text-4xl font-bold text-green-600 mt-2 tracking-tight">
                  {formattedAmount}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Your bill payment has been processed.
              </p>
            </div>
          </div>

          {/* Receipt details */}
          {payment && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <p className="text-sm font-medium text-foreground">Receipt</p>
              <div className="h-px bg-border" />
              {[
                { label: "Payment ID", value: payment.uuid?.slice(0, 16) + "…" },
                { label: "Reference", value: payment.bankRefInfo || payment.payeeRefInfo || "—" },
                { label: "Status", value: payment.status },
                ...(payment.created
                  ? [{
                      label: "Date",
                      value: new Date(payment.created).toLocaleString("en-ZA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }),
                    }]
                  : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                  <span className="text-sm font-medium text-foreground text-right break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <GiniButton
              variant="secondary"
              onClick={() => navigate("/txns")}
              className="flex-1"
            >
              View History
            </GiniButton>
            <GiniButton
              variant="primary"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Done
            </GiniButton>
          </div>
        </div>
      )}

      {/* ── Cancelled state ── */}
      {resultState === "cancelled" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 pt-8">
            <CancelIcon />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Cancelled</h1>
              <p className="text-sm text-muted-foreground mt-2">
                You cancelled the payment at your bank. No money was deducted.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <GiniButton
              variant="secondary"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Go Home
            </GiniButton>
            <GiniButton
              variant="primary"
              onClick={() => navigate("/bills")}
              className="flex-1"
            >
              Try Again
            </GiniButton>
          </div>
        </div>
      )}

      {/* ── Failed state ── */}
      {resultState === "failed" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 pt-8">
            <FailIcon />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {errorMessage || "Something went wrong with your payment."}
              </p>
            </div>
          </div>
          {payment?.apimStatus && (
            <div className="rounded-xl bg-muted/60 px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-foreground">Error details</p>
              <p className="text-xs text-muted-foreground">
                {payment.apimStatus.providerMsg || payment.apimStatus.marketplaceMsg}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <GiniButton
              variant="secondary"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Go Home
            </GiniButton>
            <GiniButton
              variant="primary"
              onClick={() => navigate("/bills")}
              className="flex-1"
            >
              Try Again
            </GiniButton>
          </div>
        </div>
      )}

      {/* ── Unknown / timed out state ── */}
      {resultState === "unknown" && (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 pt-8">
            <UnknownIcon />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Status Unknown</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {paymentUuid
                  ? "We couldn't confirm your payment status. Check your transaction history."
                  : "No payment reference found. You may have arrived here by mistake."}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <GiniButton
              variant="secondary"
              onClick={() => navigate("/txns")}
              className="flex-1"
            >
              View History
            </GiniButton>
            <GiniButton
              variant="primary"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Go Home
            </GiniButton>
          </div>
        </div>
      )}

    </div>
  );
};

export default BillResultPage;