import { useState } from "react";
import { getQrDetails } from "@/lib/api";
import { toast } from "sonner";

export const useQrPayment = () => {
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scanQr = async (qrCode: string) => {
    setLoading(true);
    try {
      const result = await getQrDetails(qrCode);
      setQrData(result);
      return result;
    } catch (error: any) {
      toast.error(error.message || "Could not read QR code. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentData: any) => {
    setLoading(true);
    try {
      // Add your QR payment API call here when ready
      console.log("💳 Processing QR payment:", paymentData);
      return null;
    } catch (error: any) {
      toast.error(error.message || "Payment failed. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setQrData(null);

  return { qrData, loading, scanQr, processPayment, reset };
};