import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { getQrCode, payQrCode, getCurrentUser, QrCodeResponse, QrPayRequest } from "@/lib/api";
import { toast } from "sonner";
import { sendSpendNotification } from "@/lib/notifications";

const FALLBACK_TOKEN = "1032563721";

type Step = "scan" | "confirm" | "paying";

const QRPayPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("scan");
  const [manualCode, setManualCode] = useState("");
  const [qrDetails, setQrDetails] = useState<QrCodeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-scanner-container";

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => { });
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    setScannerReady(false);
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(scannerDivId);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText) => {
            let token = decodedText;
            try {
              const url = new URL(decodedText);
              token = url.searchParams.get("tokenId") || decodedText;
            } catch { /* not a URL */ }
            await scanner.stop();
            setCameraActive(false);
            handleLookup(token);
          },
          () => { }
        );
        setScannerReady(true);
      } catch (err: any) {
        setCameraActive(false);
        setCameraError(err?.message?.includes("Permission")
          ? "Camera permission denied. Please allow camera access and try again."
          : "Could not start camera. Use manual entry below."
        );
      }
    }, 150);
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => { });
      scannerRef.current = null;
    }
    setCameraActive(false);
    setScannerReady(false);
  };

  const handleLookup = async (code: string) => {
    const token = code.trim() || FALLBACK_TOKEN;
    setLoading(true);
    try {
      const result = await getQrCode(token);
      setQrDetails(result);
      setStep("confirm");
    } catch (err: any) {
      toast.error(err.message || "Could not load payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    const user = getCurrentUser();
    if (!user?.accountUuid) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    if (!qrDetails) return;

    setStep("paying");
    try {
      // Matches the working cURL exactly.
      // The proxy server injects `jwt` into the body automatically — don't add it here.
      const payload: QrPayRequest = {
        feeSponsorType: qrDetails.feeSponsorType,
        paymentType: qrDetails.paymentType,
        description: qrDetails.description,
        amount: qrDetails.amount,
        gratuityAmount: qrDetails.gratuityAmount ?? 0,
        payeeAccountUuid: qrDetails.payeeAccountUuid,
        payeeRefInfo: qrDetails.payeeRefInfo,
        payeeSiteName: qrDetails.payeeSiteName,
        siteName: qrDetails.payeeSiteName,
        payeeDescription: qrDetails.payeeSiteRefInfo,
        payerDescription: qrDetails.payeeSiteRefInfo,
        payerAccountUuid: user.accountUuid,
        payerRefInfo: qrDetails.payeeSiteRefInfo,
        requestId: qrDetails.requestId,
        tokenId: qrDetails.tokenId,   // ← required by the API
      };

      console.log('💳 Submitting QR payment:', payload);
      await payQrCode(payload);
      sendSpendNotification(
        "Payment Successful 🎉",
        `R${qrDetails.amount.toFixed(2)} paid to ${qrDetails.payeeSiteName || "merchant"}`
      );
      navigate(`/Success?amount=${qrDetails.amount}&message=Payment sent successfully.`);
    } catch (err: any) {
      toast.error(err.message || "Payment failed. Please try again.");
      setStep("confirm");
    }
  };

  const handleBack = async () => {
    await stopCamera();
    if (step === "confirm") {
      setStep("scan");
      setQrDetails(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />

      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={styles.headerTitle}>
          {step === "scan" ? "Scan to Pay" : step === "confirm" ? "Confirm Payment" : "Processing..."}
        </span>
        <div style={{ width: 36 }} />
      </div>

      {step === "scan" && (
        <div style={styles.content}>
          <div style={styles.viewfinderOuter}>
            {!cameraActive ? (
              <div style={styles.viewfinderIdle}>
                {["tl", "tr", "bl", "br"].map((pos) => (
                  <div key={pos} style={{ ...styles.corner, ...cornerPos[pos] }} />
                ))}
                <div style={styles.idleInner}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="10" y="10" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.1)" />
                    <line x1="14" y1="14" x2="21" y2="14" /><line x1="14" y1="17" x2="17" y2="17" />
                    <line x1="17" y1="21" x2="21" y2="21" /><line x1="21" y1="17" x2="21" y2="21" />
                    <line x1="14" y1="20" x2="14" y2="21" />
                  </svg>
                  <button style={styles.startCameraBtn} onClick={startCamera}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    Open Camera
                  </button>
                  {cameraError && <p style={styles.cameraError}>{cameraError}</p>}
                </div>
              </div>
            ) : (
              <div style={styles.viewfinderLive}>
                {["tl", "tr", "bl", "br"].map((pos) => (
                  <div key={pos} style={{ ...styles.corner, ...cornerPos[pos], borderColor: "#7c6bff", zIndex: 10 }} />
                ))}
                <div id={scannerDivId} style={styles.scannerDiv} />
                {scannerReady && <div style={styles.scanLine} />}
                <button style={styles.stopCameraBtn} onClick={stopCamera}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Stop
                </button>
              </div>
            )}
          </div>

          <p style={styles.scanHint}>
            {cameraActive ? "Point your camera at a QR code" : "Tap to open your camera and scan a QR code"}
          </p>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or enter code manually</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.manualWrap}>
            <input
              style={styles.input}
              placeholder="Paste token or payment code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup(manualCode)}
            />
            <button
              style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
              onClick={() => handleLookup(manualCode)}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.loadingRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Looking up...
                </span>
              ) : "Continue"}
            </button>
          </div>

          <button style={styles.sandboxBtn} onClick={() => handleLookup(FALLBACK_TOKEN)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Use sandbox test token
          </button>
        </div>
      )}

      {step === "confirm" && qrDetails && (
        <div style={styles.content}>
          <div style={styles.merchantCard}>
            <div style={styles.merchantAvatar}>
              <span style={styles.merchantInitial}>
                {(qrDetails.payeeSiteName || qrDetails.description || "P")[0].toUpperCase()}
              </span>
            </div>
            <p style={styles.merchantName}>{qrDetails.payeeSiteName || qrDetails.description || "Payment"}</p>
            <p style={styles.merchantRef}>Ref: {qrDetails.payeeRefInfo}</p>
            <div style={styles.amountWrap}>
              <span style={styles.amountCurrency}>R</span>
              <span style={styles.amountValue}>{(qrDetails.amount ?? 0).toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.detailsCard}>
            {[
              { label: "Description", value: qrDetails.description || "—" },
              { label: "Site Ref", value: qrDetails.payeeSiteRefInfo || "—" },
              { label: "Token", value: qrDetails.tokenId || "—" },
              { label: "Request ID", value: qrDetails.requestId || "—" },
              { label: "Fee Sponsor", value: qrDetails.feeSponsorType || "—" },
            ].map(({ label, value }, i, arr) => (
              <div key={label} style={{
                ...styles.detailRow,
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none"
              }}>
                <span style={styles.detailLabel}>{label}</span>
                <span style={styles.detailValue}>{value}</span>
              </div>
            ))}
          </div>

          <button style={styles.primaryBtn} onClick={handlePay}>
            Pay R{(qrDetails.amount ?? 0).toFixed(2)}
          </button>
          <button style={styles.ghostBtn} onClick={() => { setStep("scan"); setQrDetails(null); }}>
            Cancel
          </button>
        </div>
      )}

      {step === "paying" && (
        <div style={styles.payingScreen}>
          <div style={styles.payingSpinner}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7c6bff" strokeWidth="2" style={{ animation: "spin 0.9s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p style={styles.payingTitle}>Processing payment...</p>
          <p style={styles.payingSubtitle}>Please don't close this screen</p>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanMove { 0%{top:12%} 50%{top:82%} 100%{top:12%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        #qr-scanner-container video { border-radius:0!important; object-fit:cover!important; width:100%!important; height:100%!important; }
        #qr-scanner-container img { display:none!important; }
        #qr-scanner-container { width:100%!important; height:100%!important; }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f5", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" },
  bgGlow: { position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,107,255,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 24px 12px", position: "relative", zIndex: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "none", color: "#f0f0f5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: 600, letterSpacing: "0.02em", color: "#f0f0f5" },
  content: { display: "flex", flexDirection: "column", padding: "12px 24px 40px", gap: 16, animation: "fadeUp 0.35s ease both", position: "relative", zIndex: 1 },
  viewfinderOuter: { borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" },
  viewfinderIdle: { height: 260, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  viewfinderLive: { height: 280, position: "relative", overflow: "hidden" },
  idleInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  scannerDiv: { position: "absolute", inset: 0, overflow: "hidden" },
  scanLine: { position: "absolute", left: "10%", right: "10%", height: 2, background: "linear-gradient(90deg, transparent, #7c6bff, #a855f7, #7c6bff, transparent)", boxShadow: "0 0 12px #7c6bff", animation: "scanMove 2.2s ease-in-out infinite", borderRadius: 2, zIndex: 5, pointerEvents: "none" },
  corner: { position: "absolute", width: 24, height: 24, borderColor: "rgba(255,255,255,0.3)", borderStyle: "solid", borderWidth: 0 },
  startCameraBtn: { background: "linear-gradient(135deg, #7c6bff, #a855f7)", border: "none", borderRadius: 12, padding: "11px 20px", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 },
  stopCameraBtn: { position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", color: "white", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, zIndex: 10 },
  cameraError: { fontSize: 12, color: "#f87171", textAlign: "center", margin: 0, maxWidth: 220 },
  scanHint: { fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center", margin: "-4px 0" },
  divider: { display: "flex", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 12, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" },
  manualWrap: { display: "flex", flexDirection: "column", gap: 10 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 18px", color: "#f0f0f5", fontSize: 15, outline: "none", fontFamily: "inherit" },
  primaryBtn: { background: "linear-gradient(135deg, #7c6bff, #a855f7)", border: "none", borderRadius: 14, padding: "15px 24px", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  loadingRow: { display: "flex", alignItems: "center", gap: 8 },
  ghostBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 24px", color: "rgba(255,255,255,0.4)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  sandboxBtn: { background: "transparent", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, alignSelf: "center", fontFamily: "inherit", padding: "4px 0" },
  merchantCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  merchantAvatar: { width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #7c6bff, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  merchantInitial: { fontSize: 26, fontWeight: 700, color: "white" },
  merchantName: { fontSize: 17, fontWeight: 700, color: "#f0f0f5", margin: 0 },
  merchantRef: { fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, fontFamily: "monospace" },
  amountWrap: { display: "flex", alignItems: "flex-start", gap: 3, marginTop: 12 },
  amountCurrency: { fontSize: 20, fontWeight: 600, color: "#7c6bff", marginTop: 6 },
  amountValue: { fontFamily: "'Sora', sans-serif", fontSize: 48, fontWeight: 800, color: "#f0f0f5", lineHeight: 1, letterSpacing: "-0.02em" },
  detailsCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px" },
  detailLabel: { fontSize: 13, color: "rgba(255,255,255,0.35)" },
  detailValue: { fontSize: 13, fontWeight: 500, color: "#f0f0f5", maxWidth: "55%", textAlign: "right" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  payingScreen: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, animation: "fadeUp 0.3s ease both" },
  payingSpinner: { width: 80, height: 80, borderRadius: "50%", background: "rgba(124,107,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" },
  payingTitle: { fontSize: 20, fontWeight: 700, color: "#f0f0f5", margin: 0 },
  payingSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 },
};

const cornerPos: Record<string, React.CSSProperties> = {
  tl: { top: 14, left: 14, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
  tr: { top: 14, right: 14, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  bl: { bottom: 14, left: 14, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
  br: { bottom: 14, right: 14, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
};

export default QRPayPage;