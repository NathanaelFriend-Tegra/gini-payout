import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRegistrationStatus } from "@/lib/api";
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("+27");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setLoading(true);
    try {
      console.log("📱 Checking registration for:", mobileNumber);
      const result = await checkRegistrationStatus(mobileNumber);
      console.log("✅ Registration status:", result);

      if (result.registered) {
        toast.info("Account found! Please login instead.");
        navigate("/login");
      } else {
        // Pass mobile number to next step
        navigate("/register/otp", { state: { mobileNumber } });
      }
    } catch (error) {
      console.error("❌ Registration check failed:", error);
      toast.error("Could not check registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground text-sm mb-8 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">Create account</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your South African mobile number to get started.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 flex-1 flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Mobile number
          </label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="+27 82 123 4567"
            className="w-full border border-input rounded-xl px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Include country code, e.g. +27744976383
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base disabled:opacity-60 mt-4"
        >
          {loading ? "Checking..." : "Continue"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;