import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────

interface ApimStatus {
  marketplaceCode: number;
  marketplaceMsg: string;
  providerCode: string;
  providerMsg: string;
  userMsg: string;
  statusCode: number;
  marketplaceId: string;
  marketplaceMocked: boolean;
}

interface MultiPaymentItem {
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

interface MultiPayRequest {
  requestId: string;
  description: string;
  payerAccountUuid: string;
  payments: MultiPaymentItem[];
  noOfInstructions: number;
}

interface MultiPaymentItemResult extends MultiPaymentItem {
  status: string;
  transactionId: string;
}

interface MultiPayResponse {
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

// Internal form row type (extends MultiPaymentItem with a local id and string amounts for inputs)
interface PaymentRow extends Omit<MultiPaymentItem, "amount" | "gratuityAmount"> {
  id: string;
  amount: string;
  gratuityAmount: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ── Helpers ───────────────────────────────────────────────────────────────

const generateUUID = (): string =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

const emptyPayment = (): PaymentRow => ({
  id: generateUUID(),
  payeeAccountUuid: "",
  payeeRefInfo: "",
  payerCategory1: "",
  payerCategory2: "",
  payerCategory3: "",
  payerRefInfo: "",
  siteRefInfo: "",
  siteName: "",
  amount: "",
  gratuityAmount: "",
});

// ── Styles ────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Mono', monospace;
    background: #0c0c0f;
    color: #e8e4dc;
    min-height: 100vh;
  }

  .wrap {
    max-width: 820px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  .header { margin-bottom: 48px; }

  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f0c040;
    margin-bottom: 10px;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 800;
    color: #f5f0e8;
    line-height: 1.1;
  }

  h1 span { color: #f0c040; }

  .subtitle {
    margin-top: 10px;
    font-size: 13px;
    color: #6b6760;
    letter-spacing: 0.02em;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b6760;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1e1e24;
  }

  .card {
    background: #13131a;
    border: 1px solid #1e1e2a;
    border-radius: 12px;
    padding: 28px;
    margin-bottom: 20px;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field.full { grid-column: 1 / -1; }

  label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5a5760;
  }

  input {
    background: #0c0c0f;
    border: 1px solid #252530;
    border-radius: 7px;
    padding: 10px 13px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #e8e4dc;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }

  input:focus {
    border-color: #f0c040;
    box-shadow: 0 0 0 3px rgba(240,192,64,0.08);
  }

  input::placeholder { color: #3a3840; }

  .payment-card {
    background: #0f0f16;
    border: 1px solid #1a1a26;
    border-left: 3px solid #f0c040;
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 14px;
    position: relative;
  }

  .payment-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .payment-num {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #f0c040;
    letter-spacing: 0.05em;
  }

  .remove-btn {
    background: none;
    border: 1px solid #2a2030;
    border-radius: 6px;
    color: #7a5070;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.06em;
  }

  .remove-btn:hover {
    border-color: #c0406080;
    color: #e07080;
    background: #200a10;
  }

  .divider {
    border: none;
    border-top: 1px dashed #1e1e28;
    margin: 16px 0;
  }

  .add-btn {
    width: 100%;
    background: #13131a;
    border: 1px dashed #2a2a38;
    border-radius: 10px;
    padding: 14px;
    color: #4a4860;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 32px;
  }

  .add-btn:hover {
    border-color: #f0c04060;
    color: #f0c040;
    background: #16161f;
  }

  .add-btn .plus { font-size: 18px; line-height: 1; }

  .submit-row { display: flex; align-items: center; gap: 16px; }

  .submit-btn {
    background: #f0c040;
    border: none;
    border-radius: 9px;
    padding: 14px 32px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0c0c0f;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  .submit-btn:hover:not(:disabled) {
    background: #f8d060;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(240,192,64,0.25);
  }

  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .status-msg { font-size: 12px; letter-spacing: 0.04em; }
  .status-msg.loading { color: #6070c0; }
  .status-msg.success { color: #50c080; }
  .status-msg.error   { color: #e05060; }

  .result-block {
    margin-top: 28px;
    background: #0a0a10;
    border: 1px solid #1a2030;
    border-radius: 10px;
    padding: 20px;
  }

  .result-block pre {
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: #70c090;
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.7;
  }

  .badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(240,192,64,0.1);
    color: #f0c040;
    border: 1px solid rgba(240,192,64,0.2);
    margin-left: 8px;
    vertical-align: middle;
  }

  .summary-bar {
    display: flex;
    gap: 24px;
    padding: 14px 20px;
    background: #0f0f18;
    border: 1px solid #1a1a28;
    border-radius: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .summary-stat { display: flex; flex-direction: column; gap: 2px; }

  .summary-stat .val {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #f0c040;
  }

  .summary-stat .lbl {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #505060;
  }

  @media (max-width: 600px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .field.full { grid-column: 1; }
  }
`;

// ── Component ─────────────────────────────────────────────────────────────

export default function MultiPaymentForm() {
  const [requestId, setRequestId] = useState<string>(generateUUID());
  const [description, setDescription] = useState<string>("Cart Checkout");
  const [payerAccountUuid, setPayerAccountUuid] = useState<string>("");
  const [payments, setPayments] = useState<PaymentRow[]>([emptyPayment()]);
  const [noOfInstructions, setNoOfInstructions] = useState<number>(1);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<MultiPayResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const updatePayment = (id: string, field: keyof PaymentRow, value: string): void => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addPayment = (): void => setPayments((prev) => [...prev, emptyPayment()]);

  const removePayment = (id: string): void =>
    setPayments((prev) => prev.filter((p) => p.id !== id));

  const totalAmount = payments.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0
  );
  const totalGratuity = payments.reduce(
    (sum, p) => sum + (parseFloat(p.gratuityAmount) || 0),
    0
  );

  const handleSubmit = async (): Promise<void> => {
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    const payload: MultiPayRequest = {
      requestId,
      description,
      payerAccountUuid,
      noOfInstructions: noOfInstructions || payments.length,
      payments: payments.map(({ id, amount, gratuityAmount, ...rest }) => ({
        ...rest,
        amount: parseFloat(amount) || 0,
        gratuityAmount: parseFloat(gratuityAmount) || 0,
      })),
    };

    try {
      const resp = await fetch("/api/payments/purchases/multi-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") ?? ""}`,
        },
        body: JSON.stringify(payload),
      });

      const json: MultiPayResponse = await resp.json();
      if (!resp.ok) throw new Error((json as unknown as { error?: string })?.error ?? `HTTP ${resp.status}`);

      setResult(json);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="wrap">

        {/* ── Header ── */}
        <div className="header">
          <div className="eyebrow">Gini Payments</div>
          <h1>Multi <span>Payment</span></h1>
          <div className="subtitle">
            Split a single checkout across multiple payees in one request
          </div>
        </div>

        {/* ── Transaction details ── */}
        <div className="card">
          <div className="section-label">Transaction Details</div>
          <div className="grid-2">
            <div className="field full">
              <label>Payer Account UUID</label>
              <input
                placeholder="b4a90a07-c197-408b-8419-ba3ed7ab3f8e"
                value={payerAccountUuid}
                onChange={(e) => setPayerAccountUuid(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label>No. of Instructions</label>
              <input
                type="number"
                min={1}
                value={noOfInstructions}
                onChange={(e) => setNoOfInstructions(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="field full">
              <label>
                Request ID <span className="badge">auto</span>
              </label>
              <input
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Summary bar ── */}
        <div className="summary-bar">
          <div className="summary-stat">
            <span className="val">{payments.length}</span>
            <span className="lbl">Payees</span>
          </div>
          <div className="summary-stat">
            <span className="val">R {totalAmount.toFixed(2)}</span>
            <span className="lbl">Total Amount</span>
          </div>
          <div className="summary-stat">
            <span className="val">R {totalGratuity.toFixed(2)}</span>
            <span className="lbl">Total Gratuity</span>
          </div>
          <div className="summary-stat">
            <span className="val">R {(totalAmount + totalGratuity).toFixed(2)}</span>
            <span className="lbl">Grand Total</span>
          </div>
        </div>

        {/* ── Payment rows ── */}
        <div className="section-label">Payments</div>

        {payments.map((p, idx) => (
          <div className="payment-card" key={p.id}>
            <div className="payment-card-header">
              <span className="payment-num">Payee #{idx + 1}</span>
              {payments.length > 1 && (
                <button className="remove-btn" onClick={() => removePayment(p.id)}>
                  Remove
                </button>
              )}
            </div>

            <div className="grid-2" style={{ marginBottom: 14 }}>
              <div className="field full">
                <label>Payee Account UUID</label>
                <input
                  placeholder="7aaf1331-67a5-4ecd-8e26-9583346b243e"
                  value={p.payeeAccountUuid}
                  onChange={(e) => updatePayment(p.id, "payeeAccountUuid", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Payee Ref Info</label>
                <input
                  placeholder="online-20200305-INV123304"
                  value={p.payeeRefInfo}
                  onChange={(e) => updatePayment(p.id, "payeeRefInfo", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Payer Ref Info</label>
                <input
                  placeholder="Groceries 20201003"
                  value={p.payerRefInfo}
                  onChange={(e) => updatePayment(p.id, "payerRefInfo", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Site Ref Info</label>
                <input
                  placeholder="ONLINE-GROC"
                  value={p.siteRefInfo}
                  onChange={(e) => updatePayment(p.id, "siteRefInfo", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Site Name</label>
                <input
                  placeholder="The Web Shop"
                  value={p.siteName}
                  onChange={(e) => updatePayment(p.id, "siteName", e.target.value)}
                />
              </div>
            </div>

            <hr className="divider" />

            <div className="grid-3" style={{ marginBottom: 14 }}>
              <div className="field">
                <label>Payer Category 1</label>
                <input
                  placeholder="Online"
                  value={p.payerCategory1}
                  onChange={(e) => updatePayment(p.id, "payerCategory1", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Payer Category 2</label>
                <input
                  placeholder="Food"
                  value={p.payerCategory2}
                  onChange={(e) => updatePayment(p.id, "payerCategory2", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Payer Category 3</label>
                <input
                  placeholder="Canned Goods"
                  value={p.payerCategory3}
                  onChange={(e) => updatePayment(p.id, "payerCategory3", e.target.value)}
                />
              </div>
            </div>

            <hr className="divider" />

            <div className="grid-2">
              <div className="field">
                <label>Amount (R)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={p.amount}
                  onChange={(e) => updatePayment(p.id, "amount", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Gratuity Amount (R)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={p.gratuityAmount}
                  onChange={(e) => updatePayment(p.id, "gratuityAmount", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button className="add-btn" onClick={addPayment}>
          <span className="plus">+</span> Add Payee
        </button>

        {/* ── Submit ── */}
        <div className="submit-row">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={status === "loading" || !payerAccountUuid}
          >
            {status === "loading" ? "Submitting…" : "Submit Payment"}
          </button>
          {status === "loading" && (
            <span className="status-msg loading">Processing multi-payment…</span>
          )}
          {status === "success" && (
            <span className="status-msg success">✓ Payment submitted successfully</span>
          )}
          {status === "error" && (
            <span className="status-msg error">✗ {errorMsg}</span>
          )}
        </div>

        {/* ── Response ── */}
        {result && (
          <div className="result-block">
            <div className="section-label" style={{ marginBottom: 12 }}>Response</div>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

      </div>
    </>
  );
}