import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(false);
  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  const message = searchParams.get("message") || "Something went wrong with your transaction.";
  const reference = searchParams.get("ref");
  const code = searchParams.get("code");

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setRingVisible(true), 300);
    const t3 = setTimeout(() => setItemsVisible(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
  const formattedTime = now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });

  const handleReport = async () => {
    setReporting(true);
    // Simulate report submission — replace with real API call when available
    await new Promise((res) => setTimeout(res, 1200));
    setReporting(false);
    setReported(true);
    toast.success("Error reported. Our team will investigate.");
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgPattern} />
      <div style={styles.topStrip} />

      <div style={styles.container}>

        {/* Icon */}
        <div style={{
          ...styles.iconWrap,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.6)",
          transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}>
          <div style={{
            ...styles.ring,
            transform: ringVisible ? "scale(1)" : "scale(0.5)",
            opacity: ringVisible ? 1 : 0,
            transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.4) 0.15s",
          }} />
          <div style={styles.iconCircle}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div style={{
          ...styles.titleWrap,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s ease 0.2s",
        }}>
          <h1 style={styles.title}>Payment Failed</h1>
          <p style={styles.subtitle}>{message}</p>
        </div>

        {/* Detail card */}
        <div style={{
          ...styles.card,
          opacity: itemsVisible ? 1 : 0,
          transform: itemsVisible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.45s ease 0.2s",
        }}>
          {[
            { label: "Status", value: "Failed", highlight: true },
            { label: "Date", value: formattedDate },
            { label: "Time", value: formattedTime },
            ...(reference ? [{ label: "Reference", value: reference }] : []),
            ...(code ? [{ label: "Error code", value: code }] : []),
          ].map(({ label, value, highlight }, i, arr) => (
            <div key={label} style={{
              ...styles.row,
              borderBottom: i < arr.length - 1 ? "1px solid #f0f0f4" : "none",
            }}>
              <span style={styles.rowLabel}>{label}</span>
              <span style={{ ...styles.rowValue, ...(highlight ? styles.rowHighlight : {}) }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Report box */}
        <div style={{
          ...styles.reportBox,
          opacity: itemsVisible ? 1 : 0,
          transition: "opacity 0.45s ease 0.3s",
        }}>
          <div style={styles.reportBoxInner}>
            <div>
              <p style={styles.reportTitle}>Something not right?</p>
              <p style={styles.reportSubtitle}>
                {reported
                  ? "Thanks — our support team has been notified and will look into this."
                  : "If you were charged or this is unexpected, report it so we can investigate."}
              </p>
            </div>
            {!reported && (
              <button
                style={{ ...styles.reportBtn, opacity: reporting ? 0.7 : 1 }}
                onClick={handleReport}
                disabled={reporting}
              >
                {reporting ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : "Report"}
              </button>
            )}
            {reported && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{
          ...styles.actions,
          opacity: itemsVisible ? 1 : 0,
          transform: itemsVisible ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.45s ease 0.4s",
        }}>
          <button style={styles.primaryBtn} onClick={() => navigate(-1 as any)}>
            Try Again
          </button>
          <button style={styles.ghostBtn} onClick={() => navigate("/")}>
            Go Home
          </button>
          <button style={styles.supportBtn} onClick={() => navigate("/support")}>
            Contact Support
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(239,68,68,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(239,68,68,0.04) 0%, transparent 50%)`,
    pointerEvents: "none",
  },
  topStrip: {
    height: 4,
    background: "linear-gradient(90deg, #ef4444, #dc2626)",
    flexShrink: 0,
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px 48px",
    maxWidth: 420,
    margin: "0 auto",
    width: "100%",
    gap: 20,
  },
  iconWrap: {
    position: "relative",
    width: 96,
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  ring: {
    position: "absolute",
    inset: -8,
    borderRadius: "50%",
    border: "2px solid rgba(239,68,68,0.2)",
    background: "rgba(239,68,68,0.04)",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(239,68,68,0.3), 0 2px 8px rgba(239,68,68,0.2)",
  },
  titleWrap: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#0f0f14",
    margin: 0,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.6,
  },
  card: {
    background: "white",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    width: "100%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "13px 18px",
  },
  rowLabel: { fontSize: 13, color: "#9ca3af" },
  rowValue: { fontSize: 13, fontWeight: 500, color: "#111827" },
  rowHighlight: { color: "#dc2626", fontWeight: 600 },
  reportBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 14,
    padding: "16px 18px",
    width: "100%",
  },
  reportBoxInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#92400e",
    margin: "0 0 3px",
  },
  reportSubtitle: {
    fontSize: 12,
    color: "#b45309",
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 240,
  },
  reportBtn: {
    background: "#f97316",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    border: "none",
    borderRadius: 14,
    padding: "15px 24px",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
    boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "14px 24px",
    color: "#6b7280",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  supportBtn: {
    background: "transparent",
    border: "none",
    padding: "8px",
    color: "#9ca3af",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
  },
};

export default ErrorPage;