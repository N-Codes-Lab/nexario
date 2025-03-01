"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Page() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const router = useRouter();

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    if (storedPhone) {
      setPhone(storedPhone);
      generateAndLogOtp();
    }
    startResendTimer();
  }, []);

  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateAndLogOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    console.log("Generated OTP:", newOtp);
    toast.success("OTP sent successfully to your phone.");
    toast.success("OTP: " + newOtp);
    startResendTimer();
  };

  const handleVerifyOtp = () => {
    const audio = new Audio("/btn_audio.wav"); // Path from public folder
    audio.play().catch((err) => console.error("Audio play failed:", err));
    setLoadingButton(true);
    if (!otp) {
      setLoadingButton(false);
      toast.error("Please enter the OTP sent to your phone.");
      return;
    }
    if (otp === generatedOtp) {
      setLoadingButton(false);
      toast.success("OTP verified successfully.");
      router.push("/auth/profile-setup");
    } else {
      setLoadingButton(false);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Toaster />
      <div className="auth-card normal-container">
        <AuthHeader
          heading="Verify Your Account"
          subHeading="Enter the OTP sent to your email or phone to confirm your account and start your journey with Nexario."
        />
        <div className="auth-form">
          <div className="mb-0 animate__animated animate__fadeInUp">
            <label htmlFor="otp">Enter OTP</label>
            <div className="flex input-container normal-container">
              <input
                type="text"
                placeholder="XXXX"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <p className="text-center mt-4 text-[#A1A1A1] forgot-text">
            Enter the OTP received on your entered email or phone number
          </p>
        </div>

        <div className="auth-form animate__animated animate__fadeInUp">
          <button
            className={`auth-button animate__animated animate__fadeInUp ${
              loadingButton ? "disable-button" : ""
            }`}
            onClick={handleVerifyOtp}
          >
            {loadingButton ? (
              <div className="spinner center">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            ) : (
              "Verify"
            )}
          </button>
          <p className="text-center animate__animated animate__fadeInUp mt-4 text-white forgot-text">
            <button
              onClick={generateAndLogOtp}
              disabled={resendDisabled}
              className={`text-[#346af7] font-medium ${
                resendDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
