import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getSavingsProfile,
  getSavingsDetail,
  updateSavingsProfile,
  clearSavingsProfile,
  getCurrentUser,
  SavingsProfile,
  SavingsDetail,
} from "@/lib/api";

type View = "loading" | "setup" | "active" | "saving";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

const SavingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("loading");
  const [profile, setProfile] = useState<SavingsProfile | null>(null);
  const [detail, setDetail] = useState<SavingsDetail | null>(null);

  // Form state
  const [targetBalance, setTargetBalance] = useState("100");
  const [monthlyIncrease, setMonthlyIncrease] = useState("2.50");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const user = getCurrentUser();
  const accountUuid = user?.accountUuid;

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accountUuid) { navigate("/login"); return; }
    loadSavings();
  }, []);

  const loadSavings = async () => {
    setView("loading");
    try {
      const [p, d] = await Promise.all([
        getSavingsProfile(accountUuid),
        getSavingsDetail(accountUuid),
      ]);
      setProfile(p);
      setDetail(d);
      if (p.enabled) {
        setTargetBalance(String(p.userSavingsBalance));
        setMonthlyIncrease(String(p.userMonthlySavingsIncrease));
        setView("active");
      } else {
        setView("setup");
      }
    } catch {
      // No savings profile yet — go to setup
      setView("setup");
    }
  };

  // ── Enable / Update ────────────────────────────────────────────────────────
  const handleSave = async () => {
    const balance = parseFloat(targetBalance);
    const increase = parseFloat(monthlyIncrease);

    if (isNaN(balance) || balance <= 0) {
      toast.error("Please enter a valid savings target.");
      return;
    }
    if (isNaN(increase) || increase < 0) {
      toast.error("Please enter a valid monthly increase.");
      return;
    }

    setView("saving");
    try {
      const updated = await updateSavingsProfile(accountUuid, [
        { op: "replace", path: "/enabled", value: true },
        { op: "replace", path: "/userSavingsBalance", value: balance },
        { op: "replace", path: "/userMonthlySavingsIncrease", value: increase },
      ]);
      setProfile(updated);
      // Refresh detail
      try {
        const d = await getSavingsDetail(accountUuid);
        setDetail(d);
      } catch { /* detail may not update instantly */ }
      toast.success("Savings plan saved!");
      setIsEditing(false);
      setView("active");
    } catch (err: any) {
      toast.error(err.message || "Could not save. Please try again.");
      setView(profile?.enabled ? "active" : "setup");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setView("saving");
    try {
      await clearSavingsProfile(accountUuid);
      setProfile(null);
      setDetail(null);
      setTargetBalance("100");
      setMonthlyIncrease("2.50");
      setConfirmDelete(false);
      toast.success("Savings plan cleared.");
      setView("setup");
    } catch (err: any) {
      toast.error(err.message || "Could not clear savings.");
      setView("active");
    }
  };

  // ── Progress bar ───────────────────────────────────────────────────────────
  const progress = (() => {
    const current = detail?.availableBalance ?? 0;
    const target = profile?.userSavingsBalance ?? 0;
    if (!target || target <= 0) return 0;
    return Math.min(Math.max((current / target) * 100, 0), 100);
  })();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.glow} />

    

      {/* ── LOADING ── */}
      {view === "loading" && (
        <div style={s.centred}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" style={{ animation: "spin 0.9s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={s.loadingText}>Loading your savings...</p>
        </div>
      )}

      {/* ── PROCESSING ── */}
      {view === "saving" && (
        <div style={s.centred}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" style={{ animation: "spin 0.9s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={s.loadingText}>Updating your plan...</p>
        </div>
      )}

      {/* ── SETUP ── */}
      {view === "setup" && (
        <div style={s.content}>
          {/* Hero */}
          <div style={s.heroCard}>
            <div style={s.heroIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2 style={s.heroTitle}>Start saving today</h2>
            <p style={s.heroSub}>Set a target balance and let your money grow automatically each month.</p>
          </div>

          {/* Form */}
          <div style={s.formCard}>
            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Savings Target (ZAR)</label>
              <div style={s.inputWrap}>
                <span style={s.inputPrefix}>R</span>
                <input
                  style={s.input}
                  type="number"
                  min="1"
                  step="0.01"
                  value={targetBalance}
                  onChange={(e) => setTargetBalance(e.target.value)}
                  placeholder="100.00"
                />
              </div>
              <p style={s.fieldHint}>The balance you'd like to maintain in savings.</p>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.fieldLabel}>Monthly Increase (ZAR)</label>
              <div style={s.inputWrap}>
                <span style={s.inputPrefix}>R</span>
                <input
                  style={s.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyIncrease}
                  onChange={(e) => setMonthlyIncrease(e.target.value)}
                  placeholder="2.50"
                />
              </div>
              <p style={s.fieldHint}>Auto-increase your savings target by this amount each month.</p>
            </div>
          </div>

          <button style={s.primaryBtn} onClick={handleSave}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            Enable Savings
          </button>
        </div>
      )}

      {/* ── ACTIVE ── */}
      {view === "active" && profile && (
        <div style={s.content}>
          {/* Progress card */}
          <div style={s.progressCard}>
            <div style={s.progressHeader}>
              <div>
                <p style={s.progressLabel}>Wallet Balance</p>
                <p style={s.progressAmount}>
                  {fmt(detail?.availableBalance ?? 0)}
                </p>
              </div>
              <div style={s.enabledBadge}>
                <div style={s.enabledDot} />
                Active
              </div>
            </div>

            {/* Progress bar */}
            <div style={s.barTrack}>
              <div style={{ ...s.barFill, width: `${progress}%` }} />
            </div>
            <div style={s.barLabels}>
              <span style={s.barLabel}>R0</span>
              <span style={s.barLabel}>{fmt(profile.userSavingsBalance)}</span>
            </div>
            <p style={s.progressPct}>{progress.toFixed(0)}% of target reached</p>
          </div>

          {/* Stats */}
          <div style={s.statsRow}>
            {[
              { label: "Target Balance", value: fmt(profile.userSavingsBalance) },
              { label: "Monthly Increase", value: fmt(profile.userMonthlySavingsIncrease) },
            ].map(({ label, value }) => (
              <div key={label} style={s.statCard}>
                <p style={s.statLabel}>{label}</p>
                <p style={s.statValue}>{value}</p>
              </div>
            ))}
          </div>

          {/* Edit form — only visible when editing */}
          {isEditing && (
            <div style={s.formCard}>
              <p style={s.sectionTitle}>Update Plan</p>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Savings Target (ZAR)</label>
                <div style={s.inputWrap}>
                  <span style={s.inputPrefix}>R</span>
                  <input
                    style={s.input}
                    type="number"
                    min="1"
                    step="0.01"
                    value={targetBalance}
                    onChange={(e) => setTargetBalance(e.target.value)}
                  />
                </div>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Monthly Increase (ZAR)</label>
                <div style={s.inputWrap}>
                  <span style={s.inputPrefix}>R</span>
                  <input
                    style={s.input}
                    type="number"
                    min="0"
                    step="0.01"
                    value={monthlyIncrease}
                    onChange={(e) => setMonthlyIncrease(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {isEditing ? (
            <>
              <button style={s.primaryBtn} onClick={handleSave}>
                Save Changes
              </button>
              <button style={s.ghostBtn} onClick={() => {
                setIsEditing(false);
                setConfirmDelete(false);
                // Reset form to current profile values
                setTargetBalance(String(profile.userSavingsBalance));
                setMonthlyIncrease(String(profile.userMonthlySavingsIncrease));
              }}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button style={s.secondaryBtn} onClick={() => setIsEditing(true)}>
                Edit Plan
              </button>

              {/* Delete */}
              <button
                style={confirmDelete ? s.dangerBtnConfirm : s.dangerBtn}
                onClick={handleDelete}
              >
                {confirmDelete ? "⚠️ Tap again to confirm deletion" : "Clear Savings Plan"}
              </button>
              {confirmDelete && (
                <button style={s.ghostBtn} onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

// ── Styles — uses app CSS variables from index.css ────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: -100, left: "50%",
    transform: "translateX(-50%)",
    width: 500, height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "52px 24px 16px", position: "relative", zIndex: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    background: "hsl(var(--muted))",
    border: "1px solid hsl(var(--border))",
    color: "hsl(var(--foreground))", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16, fontWeight: 700,
    letterSpacing: "0.02em", color: "hsl(var(--foreground))",
  },
  centred: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 16,
  },
  loadingText: { fontSize: 14, color: "hsl(var(--muted-foreground))", margin: 0 },
  content: {
    display: "flex", flexDirection: "column",
    padding: "8px 24px 48px", gap: 16,
    animation: "fadeUp 0.35s ease both",
    position: "relative", zIndex: 1,
  },

  // Hero
  heroCard: {
    background: "hsl(var(--primary) / 0.06)",
    border: "1px solid hsl(var(--primary) / 0.2)",
    borderRadius: 20, padding: "28px 24px",
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 10, textAlign: "center" as const,
  },
  heroIcon: {
    width: 64, height: 64, borderRadius: 20,
    background: "hsl(var(--primary) / 0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22, fontWeight: 800,
    color: "hsl(var(--foreground))", margin: 0,
  },
  heroSub: {
    fontSize: 14, color: "hsl(var(--muted-foreground))",
    margin: 0, lineHeight: 1.6, maxWidth: 260,
  },

  // Progress
  progressCard: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 20, padding: "24px 20px",
    boxShadow: "var(--shadow-card)",
  },
  progressHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 20,
  },
  progressLabel: { fontSize: 12, color: "hsl(var(--muted-foreground))", margin: "0 0 4px" },
  progressAmount: {
    fontSize: 32, fontWeight: 800,
    color: "hsl(var(--foreground))", margin: 0, lineHeight: 1,
  },
  enabledBadge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "hsl(var(--success) / 0.1)",
    border: "1px solid hsl(var(--success) / 0.3)",
    borderRadius: 20, padding: "4px 12px",
    fontSize: 12, fontWeight: 600, color: "hsl(var(--success))",
  },
  enabledDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "hsl(var(--success))",
  },
  barTrack: {
    height: 8, borderRadius: 4,
    background: "hsl(var(--muted))",
    overflow: "hidden",
  },
  barFill: {
    height: "100%", borderRadius: 4,
    background: "var(--gradient-primary)",
    transition: "width 0.6s ease",
  },
  barLabels: {
    display: "flex", justifyContent: "space-between",
    marginTop: 6,
  },
  barLabel: { fontSize: 11, color: "hsl(var(--muted-foreground))" },
  progressPct: {
    fontSize: 12, color: "hsl(var(--primary))",
    margin: "8px 0 0", textAlign: "center" as const, fontWeight: 600,
  },

  // Stats
  statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  statCard: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 14, padding: "16px 14px",
    boxShadow: "var(--shadow-sm)",
  },
  statLabel: { fontSize: 11, color: "hsl(var(--muted-foreground))", margin: "0 0 6px" },
  statValue: { fontSize: 18, fontWeight: 700, color: "hsl(var(--foreground))", margin: 0 },

  // Form
  formCard: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 16, padding: "20px",
    display: "flex", flexDirection: "column", gap: 16,
    boxShadow: "var(--shadow-sm)",
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "hsl(var(--muted-foreground))", margin: 0,
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" },
  fieldHint: { fontSize: 12, color: "hsl(var(--muted-foreground))", margin: 0 },
  inputWrap: {
    display: "flex", alignItems: "center",
    background: "hsl(var(--muted))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12, overflow: "hidden",
  },
  inputPrefix: {
    padding: "0 12px", fontSize: 16, fontWeight: 700,
    color: "hsl(var(--primary))",
    borderRight: "1px solid hsl(var(--border))",
  },
  input: {
    flex: 1, background: "transparent", border: "none",
    padding: "13px 14px", color: "hsl(var(--foreground))",
    fontSize: 15, outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },

  // Buttons
  primaryBtn: {
    background: "var(--gradient-primary)",
    border: "none", borderRadius: 14, padding: "15px 24px",
    color: "hsl(var(--primary-foreground))", fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    letterSpacing: "0.01em", boxShadow: "var(--shadow-button)",
  },
  secondaryBtn: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 14, padding: "15px 24px",
    color: "hsl(var(--foreground))", fontSize: 15, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "var(--shadow-sm)",
  },
  dangerBtn: {
    background: "transparent",
    border: "1px solid hsl(var(--destructive) / 0.3)",
    borderRadius: 14, padding: "14px 24px",
    color: "hsl(var(--destructive) / 0.7)", fontSize: 14,
    cursor: "pointer", fontFamily: "inherit",
  },
  dangerBtnConfirm: {
    background: "hsl(var(--destructive) / 0.08)",
    border: "1px solid hsl(var(--destructive) / 0.4)",
    borderRadius: 14, padding: "14px 24px",
    color: "hsl(var(--destructive))", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  ghostBtn: {
    background: "transparent", border: "none",
    color: "hsl(var(--muted-foreground))", fontSize: 13,
    cursor: "pointer", fontFamily: "inherit", padding: "4px 0",
    alignSelf: "center" as const,
  },
};

export default SavingsPage;