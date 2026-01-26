import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // userId passed from login page
  const userId = location.state?.userId;

  if (!userId) {
    navigate("/login");
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        userId,
        otp,
      });

      // Store JWT + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("OTP verified successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={handleVerify}
        className="card bg-base-100 p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-center mb-4">
          Enter the 6-digit OTP sent to your email
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter OTP"
          className="input input-bordered mb-4 text-center tracking-widest"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
