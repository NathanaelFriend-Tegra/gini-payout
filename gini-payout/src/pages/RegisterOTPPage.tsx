import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendOTP, verifyOTP } from "@/lib/api";
import { toast } from "sonner";

const OMNEA_BASE_URL = import.meta.env.VITE_PROXY_URL || "http://localhost:3001";


const RegisterOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSendOTP();
  }, []);

  const handleSendOTP = async () => {
    try {
      console.log("📤 Sending OTP to:", mobileNumber);
      await sendOTP(mobileNumber);
      toast.success("OTP sent! (Sandbox OTP: 11111)");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOTP({ mobileNumber, otp });
      toast.success("Number verified!");
      navigate("/register/details", { state: { mobileNumber, otp } });
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
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
        <h1 className="text-2xl font-bold text-foreground">Verify your number</h1>
        <p className="text-muted-foreground mt-2 text-sm">We sent a code to {mobileNumber}.</p>
        {import.meta.env.DEV && (
          <p className="text-xs text-amber-600 mt-1 bg-amber-50 px-3 py-1 rounded-lg">
            🧪 Sandbox: OTP is <strong>11111</strong>
          </p>
        )}
      </div>

      <div className="px-6 flex-1 flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">OTP code</label>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="11111"
            className="w-full border border-input rounded-xl px-4 py-3 text-2xl tracking-widest text-center bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button onClick={handleVerifyOTP} disabled={loading} className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base disabled:opacity-60">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button onClick={handleSendOTP} className="text-center text-sm text-primary font-medium">
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default RegisterOTPPage;