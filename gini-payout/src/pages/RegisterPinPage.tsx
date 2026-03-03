import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const OMNEA_BASE_URL = import.meta.env.VITE_PROXY_URL || "http://localhost:3001";

const RegisterPinPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber || "";
  const otp = location.state?.otp || "";

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetPin = async () => {
    if (pin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${OMNEA_BASE_URL}/api/auth/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, otp, pin }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to set PIN");
      }
      toast.success("Account ready! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to set PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-12 pb-8">
        <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm mb-8 flex items-center gap-2">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">Set your PIN</h1>
        <p className="text-muted-foreground mt-2 text-sm">Choose a 4-digit PIN you'll use to log in.</p>
      </div>

      <div className="px-6 flex-1 flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">New PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            maxLength={6}
            className="w-full border border-input rounded-xl px-4 py-3 text-2xl tracking-widest text-center bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Confirm PIN</label>
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="••••"
            maxLength={6}
            className="w-full border border-input rounded-xl px-4 py-3 text-2xl tracking-widest text-center bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button onClick={handleSetPin} disabled={loading} className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base disabled:opacity-60 mt-2">
          {loading ? "Setting PIN..." : "Complete registration"}
        </button>
      </div>
    </div>
  );
};

export default RegisterPinPage;