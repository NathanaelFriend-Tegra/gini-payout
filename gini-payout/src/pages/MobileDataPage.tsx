import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    getMobileMerchants,
    getMobileProducts,
    purchaseMobileProduct,
    getMobilePurchaseHistory,
    getMobileProduct,
    getCurrentUser,
    MobileMerchant,
    MobileProduct,
    MobilePurchaseHistoryItem,
} from "@/lib/api";

type Step = "loading" | "network" | "product" | "number" | "confirm" | "processing" | "success" | "history";

// Network brand colours for visual identity
const NETWORK_COLORS: Record<string, { bg: string; accent: string; logo: string }> = {
    Vodacom: { bg: "hsl(0 72% 51%)", accent: "hsl(0 72% 40%)", logo: "V" },
    MTN: { bg: "hsl(43 96% 50%)", accent: "hsl(43 96% 38%)", logo: "M" },
    CellC: { bg: "hsl(0, 0%, 1%)", accent: "hsl(220 60% 22%)", logo: "C" },
    TelkomMobile: { bg: "hsl(221, 100%, 60%)", accent: "hsl(152 69% 26%)", logo: "T" },
};

const fmt = (n: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

const MobileDataPage: React.FC = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const accountUuid = user?.accountUuid;

    const [step, setStep] = useState<Step>("loading");
    const [merchants, setMerchants] = useState<MobileMerchant[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<MobileMerchant | null>(null);
    const [products, setProducts] = useState<MobileProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<MobileProduct | null>(null);
    const [mobileNumber, setMobileNumber] = useState("");
    const [history, setHistory] = useState<MobilePurchaseHistoryItem[]>([]);
    const [successData, setSuccessData] = useState<any>(null);
    const [category, setCategory] = useState<"ALL" | "AIRTIME" | "DATA" | "OTHER" | null>(null);

    // ── Load merchants on mount ────────────────────────────────────────────────
    useEffect(() => {
        if (!accountUuid) { navigate("/login"); return; }
        loadMerchants();
    }, []);

    const loadMerchants = async () => {
        setStep("loading");
        try {
            const res = await getMobileMerchants();
            setMerchants(res.values ?? []);
            setStep("network");
        } catch {
            toast.error("Could not load networks. Please try again.");
            setStep("network");
        }
    };

    // ── Select network → load products ────────────────────────────────────────
    const handleSelectMerchant = async (merchant: MobileMerchant) => {
        setSelectedMerchant(merchant);
        setCategory("ALL");
        setStep("loading");
        try {
            const res = await getMobileProducts(merchant.uuid);
            setProducts(res.values ?? []);
            setStep("product");
        } catch {
            toast.error("Could not load products for this network.");
            setStep("network");
        }
    };

    const [productDetail, setProductDetail] = useState<MobileProduct | null>(null);

    // ── Select product → fetch detail → enter number ──────────────────────────
    const handleSelectProduct = async (product: MobileProduct) => {
        setSelectedProduct(product);
        setStep("loading");
        try {
            const detail = await getMobileProduct(product.uuid);
            setProductDetail(detail);
        } catch {
            // Fall back to list data if detail fetch fails
            setProductDetail(product);
        }
        setStep("number");
    };

    // ── Validate number → confirm ──────────────────────────────────────────────
    const handleNumberNext = () => {
        const cleaned = mobileNumber.replace(/\s+/g, "");
        if (!/^(\+27|0)[6-8][0-9]{8}$/.test(cleaned)) {
            toast.error("Please enter a valid South African mobile number.");
            return;
        }
        setStep("confirm");
    };

    // ── Confirm → purchase ─────────────────────────────────────────────────────
    const handlePurchase = async () => {
        if (!selectedProduct || !selectedMerchant) return;
        setStep("processing");

        const cleaned = mobileNumber.replace(/\s+/g, "");
        const e164 = cleaned.startsWith("0") ? "+27" + cleaned.slice(1) : cleaned;

        try {
            const result = await purchaseMobileProduct({
                payerAccountUuid: accountUuid,
                payerCategory1: selectedMerchant.name,
                payerCategory2: productDetail?.productType ?? "",
                payerCategory3: productDetail?.productCode ?? "",
                payerRefInfo: "Prepaid",
                productUuid: productDetail?.uuid ?? selectedProduct.uuid,
                itemNumber: e164,
                amount: productDetail?.amount ?? selectedProduct.amount,
            });
            setSuccessData(result);
            setStep("success");
            toast.success("Purchase successful!");
        } catch (err: any) {
            toast.error(err.message || "Purchase failed. Please try again.");
            setStep("confirm");
        }
    };

    // ── Load history ───────────────────────────────────────────────────────────
    const handleViewHistory = async () => {
        setStep("loading");
        try {
            const res = await getMobilePurchaseHistory(accountUuid);
            setHistory(res.values ?? []);
            setStep("history");
        } catch {
            toast.error("Could not load purchase history.");
            setStep("network");
        }
    };

    // ── Reset to start ─────────────────────────────────────────────────────────
    const handleReset = () => {
        setSelectedMerchant(null);
        setSelectedProduct(null);
        setProductDetail(null);
        setMobileNumber("");
        setSuccessData(null);
        setCategory("ALL");
        setStep("network");
    };

    const networkStyle = selectedMerchant
        ? NETWORK_COLORS[selectedMerchant.name] ?? { bg: "hsl(var(--primary))", accent: "hsl(var(--primary))", logo: "?" }
        : null;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={s.page}>
            {/* ── LOADING ── */}
            {step === "loading" && (
                <div style={s.centred}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" style={{ animation: "spin 0.9s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p style={s.mutedText}>Loading...</p>
                </div>
            )}

            {/* ── STEP 1: CHOOSE NETWORK ── */}
            {step === "network" && (
                <div style={s.content}>
                    <p style={s.stepLabel}>Step 1 of 3 — Choose your network</p>
                    <div style={s.networkGrid}>
                        {merchants.length === 0 ? (
                            <p style={s.mutedText}>No networks available.</p>
                        ) : merchants.map((m) => {
                            const nc = NETWORK_COLORS[m.name] ?? { bg: "hsl(var(--primary))", accent: "", logo: m.name[0] };
                            return (
                                <button key={m.uuid} style={{ ...s.networkCard, background: nc.bg }} onClick={() => handleSelectMerchant(m)}>
                                    <div style={s.networkLogo}>{nc.logo}</div>
                                    <span style={s.networkName}>{m.name}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── STEP 2: CHOOSE PRODUCT ── */}
            {step === "product" && (
                <div style={s.content}>
                    {networkStyle && (
                        <div style={{ ...s.networkBanner, background: networkStyle.bg }}>
                            <div style={s.networkBannerLogo}>{networkStyle.logo}</div>
                            <div>
                                <p style={s.networkBannerName}>{selectedMerchant?.name}</p>
                                <p style={s.networkBannerSub}>{products.length} bundles available</p>
                            </div>
                        </div>
                    )}
                    <p style={s.stepLabel}>Step 2 of 3 — Choose a bundle</p>

                    {/* Category filter tabs */}
                    <div style={s.tabRow}>
                        {(["ALL", "AIRTIME", "DATA", "OTHER"] as const).map((cat) => (
                            <button
                                key={cat}
                                style={{ ...s.tab, ...(category === cat ? s.tabActive : {}) }}
                                onClick={() => setCategory(prev => prev === cat ? null : cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {(() => {
                        const filtered = category === "ALL"
                            ? products
                            : products.filter(p => p.productType === category);
                        return filtered.length === 0 ? (
                            <div style={s.emptyCard}>
                                <p style={{ margin: 0, color: "hsl(var(--muted-foreground))", fontSize: 14 }}>
                                    {products.length === 0
                                        ? "No products available for this network in the sandbox."
                                        : `No ${category} products available for this network.`}
                                </p>
                            </div>
                        ) : (
                            <div style={s.productList}>
                                {filtered.map((p) => (
                                    <button key={p.uuid} style={s.productCard} onClick={() => handleSelectProduct(p)}>
                                        <div style={s.productLeft}>
                                            <span style={s.productType}>{p.productType}</span>
                                            <span style={s.productDesc}>{p.description}</span>
                                        </div>
                                        <div style={s.productRight}>
                                            <span style={s.productAmount}>{fmt(p.amount)}</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* ── STEP 3: ENTER NUMBER ── */}
            {step === "number" && (
                <div style={s.content}>
                    <div style={s.summaryChip}>
                        <span style={s.summaryChipText}>{selectedMerchant?.name} · {productDetail?.description} · {fmt(productDetail?.amount ?? 0)}</span>
                    </div>
                    <p style={s.stepLabel}>Step 3 of 3 — Enter recipient number</p>
                    <div style={s.formCard}>
                        <label style={s.fieldLabel}>Mobile Number</label>
                        <div style={s.inputWrap}>
                            <span style={s.inputPrefix}>🇿🇦</span>
                            <input
                                style={s.input}
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="071 234 5678"
                                maxLength={13}
                            />
                        </div>
                        <p style={s.fieldHint}>Enter the number to top up. Accepts 0XX or +27XX format.</p>

                        <button style={s.selfBtn} onClick={() => setMobileNumber(user?.mobileNumber ?? "")}>
                            Use my number
                        </button>
                    </div>
                    <button style={s.primaryBtn} onClick={handleNumberNext}>
                        Continue
                    </button>
                </div>
            )}

            {/* ── CONFIRM ── */}
            {step === "confirm" && (
                <div style={s.content}>
                    <div style={s.confirmCard}>
                        <p style={s.confirmTitle}>Review your purchase</p>
                        <div style={s.confirmRows}>
                            {[
                                { label: "Network", value: selectedMerchant?.name ?? "" },
                                { label: "Bundle", value: productDetail?.description ?? "" },
                                { label: "Type", value: productDetail?.productType ?? "" },
                                { label: "Amount", value: fmt(productDetail?.amount ?? 0) },
                                { label: "Send to", value: mobileNumber },
                            ].map(({ label, value }) => (
                                <div key={label} style={s.confirmRow}>
                                    <span style={s.confirmLabel}>{label}</span>
                                    <span style={s.confirmValue}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button style={s.primaryBtn} onClick={handlePurchase}>
                        Confirm & Pay {fmt(productDetail?.amount ?? 0)}
                    </button>
                    <button style={s.ghostBtn} onClick={() => setStep("number")}>
                        Edit number
                    </button>
                </div>
            )}

            {/* ── PROCESSING ── */}
            {step === "processing" && (
                <div style={s.centred}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" style={{ animation: "spin 0.9s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p style={s.mutedText}>Processing purchase...</p>
                </div>
            )}

            {/* ── SUCCESS ── */}
            {step === "success" && (
                <div style={s.content}>
                    <div style={s.successCard}>
                        <div style={s.successIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success))" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h2 style={s.successTitle}>All done!</h2>
                        <p style={s.successSub}>
                            {fmt(productDetail?.amount ?? 0)} {productDetail?.productType?.toLowerCase()} sent to {mobileNumber}
                        </p>
                    </div>
                    <div style={s.confirmCard}>
                        <p style={s.confirmTitle}>Receipt</p>
                        <div style={s.confirmRows}>
                            {[
                                { label: "Network", value: selectedMerchant?.name ?? "" },
                                { label: "Bundle", value: productDetail?.description ?? "" },
                                { label: "Amount", value: fmt(productDetail?.amount ?? 0) },
                                { label: "Sent to", value: mobileNumber },
                            ].map(({ label, value }) => (
                                <div key={label} style={s.confirmRow}>
                                    <span style={s.confirmLabel}>{label}</span>
                                    <span style={s.confirmValue}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button style={s.primaryBtn} onClick={handleReset}>
                        Buy Again
                    </button>
                    <button style={s.ghostBtn} onClick={() => navigate("/")}>
                        Back to Home
                    </button>
                </div>
            )}

            {/* ── HISTORY ── */}
            {step === "history" && (
                <div style={s.content}>
                    {history.length === 0 ? (
                        <div style={s.emptyCard}>
                            <p style={{ margin: 0, color: "hsl(var(--muted-foreground))", fontSize: 14 }}>
                                No purchases yet.
                            </p>
                        </div>
                    ) : (
                        <div style={s.productList}>
                            {history.map((h) => (
                                <div key={h.uuid} style={s.historyCard}>
                                    <div style={s.productLeft}>
                                        <span style={s.productType}>{h.payerCategory1}</span>
                                        <span style={s.productDesc}>{h.itemNumber}</span>
                                        <span style={{ ...s.fieldHint, marginTop: 2 }}>{fmtDate(h.created)}</span>
                                    </div>
                                    <span style={s.productAmount}>{fmt(h.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
    },
    header: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "52px 24px 16px",
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 10,
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        color: "hsl(var(--foreground))", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    historyBtn: {
        width: 36, height: 36, borderRadius: 10,
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        color: "hsl(var(--foreground))", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    headerTitle: {
        fontSize: 16, fontWeight: 700,
        letterSpacing: "0.02em",
    },
    centred: {
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
    },
    content: {
        display: "flex", flexDirection: "column",
        padding: "8px 24px 48px", gap: 14,
        animation: "fadeUp 0.3s ease both",
    },
    stepLabel: {
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "hsl(var(--muted-foreground))", margin: 0,
    },
    mutedText: {
        fontSize: 14, color: "hsl(var(--muted-foreground))", margin: 0,
    },

    // Network grid
    networkGrid: {
        display: "flex", flexDirection: "column", gap: 10,
    },
    networkCard: {
        borderRadius: 16, padding: "18px 20px",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 14,
        textAlign: "left" as const,
    },
    networkLogo: {
        width: 44, height: 44, borderRadius: 12,
        background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, fontWeight: 800, color: "#fff",
        flexShrink: 0,
    },
    networkName: {
        flex: 1, fontSize: 16, fontWeight: 700, color: "#fff",
    },

    // Network banner
    networkBanner: {
        borderRadius: 16, padding: "16px 18px",
        display: "flex", alignItems: "center", gap: 14,
    },
    networkBannerLogo: {
        width: 40, height: 40, borderRadius: 10,
        background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 800, color: "#fff",
        flexShrink: 0,
    },
    networkBannerName: {
        fontSize: 15, fontWeight: 700, color: "#fff", margin: 0,
    },
    networkBannerSub: {
        fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "2px 0 0",
    },

    // Product list
    productList: { display: "flex", flexDirection: "column", gap: 8 },
    productCard: {
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 14, padding: "16px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", textAlign: "left" as const,
        boxShadow: "var(--shadow-sm)",
    },
    productLeft: { display: "flex", flexDirection: "column", gap: 3 },
    productRight: { display: "flex", alignItems: "center", gap: 8 },
    productType: {
        fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
        textTransform: "uppercase" as const,
        color: "hsl(var(--primary))",
    },
    productDesc: { fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" },
    productAmount: { fontSize: 16, fontWeight: 700, color: "hsl(var(--foreground))" },

    // History
    historyCard: {
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 14, padding: "16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "var(--shadow-sm)",
    },

    // Empty
    emptyCard: {
        background: "hsl(var(--muted))",
        borderRadius: 14, padding: "24px",
        textAlign: "center" as const,
    },

    // Summary chip
    summaryChip: {
        background: "hsl(var(--primary) / 0.08)",
        border: "1px solid hsl(var(--primary) / 0.2)",
        borderRadius: 20, padding: "8px 14px",
        alignSelf: "flex-start" as const,
    },
    summaryChipText: {
        fontSize: 13, fontWeight: 600, color: "hsl(var(--primary))",
    },

    // Form
    formCard: {
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 16, padding: "20px",
        display: "flex", flexDirection: "column", gap: 10,
        boxShadow: "var(--shadow-sm)",
    },
    fieldLabel: { fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" },
    fieldHint: { fontSize: 12, color: "hsl(var(--muted-foreground))", margin: 0 },
    inputWrap: {
        display: "flex", alignItems: "center",
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 12, overflow: "hidden",
    },
    inputPrefix: {
        padding: "0 12px", fontSize: 18,
        borderRight: "1px solid hsl(var(--border))",
    },
    input: {
        flex: 1, background: "transparent", border: "none",
        padding: "13px 14px", color: "hsl(var(--foreground))",
        fontSize: 15, outline: "none",
        fontFamily: "'DM Sans', sans-serif",
    },
    selfBtn: {
        background: "transparent", border: "none",
        color: "hsl(var(--primary))", fontSize: 13, fontWeight: 600,
        cursor: "pointer", padding: 0, alignSelf: "flex-start" as const,
        fontFamily: "inherit",
    },

    // Confirm card
    confirmCard: {
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 16, padding: "20px",
        boxShadow: "var(--shadow-sm)",
    },
    confirmTitle: {
        fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "hsl(var(--muted-foreground))", margin: "0 0 14px",
    },
    confirmRows: { display: "flex", flexDirection: "column", gap: 12 },
    confirmRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    confirmLabel: { fontSize: 13, color: "hsl(var(--muted-foreground))" },
    confirmValue: { fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" },

    // Success
    successCard: {
        background: "hsl(var(--success) / 0.06)",
        border: "1px solid hsl(var(--success) / 0.2)",
        borderRadius: 20, padding: "28px 24px",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 10, textAlign: "center" as const,
    },
    successIcon: {
        width: 64, height: 64, borderRadius: 20,
        background: "hsl(var(--success) / 0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
    },
    successTitle: {
        fontSize: 22, fontWeight: 800, color: "hsl(var(--foreground))", margin: 0,
    },
    successSub: {
        fontSize: 14, color: "hsl(var(--muted-foreground))",
        margin: 0, lineHeight: 1.6,
    },

    // Buttons
    primaryBtn: {
        background: "var(--gradient-primary)",
        border: "none", borderRadius: 14, padding: "15px 24px",
        color: "hsl(var(--primary-foreground))", fontSize: 15, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        textAlign: "center" as const, boxShadow: "var(--shadow-button)",
    },
    ghostBtn: {
        background: "transparent", border: "none",
        color: "hsl(var(--muted-foreground))", fontSize: 13,
        cursor: "pointer", fontFamily: "inherit", padding: "4px 0",
        alignSelf: "center" as const,
    },
    tabRow: {
        display: "flex", gap: 8,
    },
    tab: {
        flex: 1, padding: "9px 0", borderRadius: 10,
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit",
    },
    tabActive: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "1px solid hsl(var(--primary))",
    },
};

export default MobileDataPage;