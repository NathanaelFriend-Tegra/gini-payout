import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const amount = searchParams.get("amount");
  const reference = searchParams.get("ref");
  const message = searchParams.get("message") || "Your transaction was completed successfully.";
  const redirectTo = searchParams.get("redirect") || "/";

  // Entrance animations
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setRingVisible(true), 300);
    const t3 = setTimeout(() => setItemsVisible(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Countdown + auto-redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          navigate(redirectTo);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, redirectTo]);

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-ZA", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={styles.page}>
      <div style={styles.bgPattern} />
      <div style={styles.topStrip} />

      <div style={styles.container}>

        {/* Success icon */}
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
          <div style={styles.checkCircle}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
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
          <h1 style={styles.title}>Success!</h1>
          <p style={styles.subtitle}>{message}</p>
        </div>

        {/* Amount pill */}
        {amount && (
          <div style={{
            ...styles.amountPill,
            opacity: itemsVisible ? 1 : 0,
            transform: itemsVisible ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.45s ease 0.1s",
          }}>
            <span style={styles.amountLabel}>Amount</span>
            <span style={styles.amountValue}>R{parseFloat(amount).toFixed(2)}</span>
          </div>
        )}

        {/* Detail card */}
        <div style={{
          ...styles.card,
          opacity: itemsVisible ? 1 : 0,
          transform: itemsVisible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.45s ease 0.2s",
        }}>
          {[
            { label: "Status", value: "Completed", highlight: true },
            { label: "Date", value: formattedDate },
            { label: "Time", value: formattedTime },
            ...(reference ? [{ label: "Reference", value: reference }] : []),
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

        {/* Countdown */}
        <div style={{
          ...styles.countdownWrap,
          opacity: itemsVisible ? 1 : 0,
          transition: "opacity 0.45s ease 0.3s",
        }}>
          {/* Progress ring */}
          <svg width="48" height="48" style={{ position: "absolute" }}>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 5)}`}
              transform="rotate(-90 24 24)"
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <span style={styles.countdownNumber}>{countdown}</span>
        </div>

        <p style={{
          ...styles.redirectText,
          opacity: itemsVisible ? 1 : 0,
          transition: "opacity 0.45s ease 0.35s",
        }}>
          Redirecting you home in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>

        {/* Actions */}
        <div style={{
          ...styles.actions,
          opacity: itemsVisible ? 1 : 0,
          transform: itemsVisible ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.45s ease 0.4s",
        }}>
          <button style={styles.primaryBtn} onClick={() => navigate("/")}>
            Go Home Now
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
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
    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 50%)`,
    pointerEvents: "none",
  },
  topStrip: {
    height: 4,
    background: "linear-gradient(90deg, #6366f1, #10b981)",
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
    border: "2px solid rgba(16,185,129,0.2)",
    background: "rgba(16,185,129,0.04)",
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(16,185,129,0.3), 0 2px 8px rgba(16,185,129,0.2)",
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
  amountPill: {
    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "1px solid #bbf7d0",
    borderRadius: 16,
    padding: "16px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    width: "100%",
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#059669",
  },
  amountValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 36,
    fontWeight: 800,
    color: "#065f46",
    letterSpacing: "-0.03em",
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
  rowLabel: {
    fontSize: 13,
    color: "#9ca3af",
  },
  rowValue: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111827",
  },
  rowHighlight: {
    color: "#059669",
    fontWeight: 600,
  },
  countdownWrap: {
    position: "relative",
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownNumber: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#6366f1",
    position: "relative",
    zIndex: 1,
  },
  redirectText: {
    fontSize: 13,
    color: "#9ca3af",
    margin: 0,
    marginTop: -8,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    border: "none",
    borderRadius: 14,
    padding: "15px 24px",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
    boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
  },
};

export default SuccessPage;