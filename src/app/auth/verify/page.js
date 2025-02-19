"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const [generatedOtp, setGeneratedOtp] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    if (storedPhone) {
      setPhone(storedPhone);
      generateAndLogOtp();
    }
  }, []);

  // Function to generate a random 4-digit OTP
  const generateAndLogOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    console.log("Generated OTP:", newOtp);

    // Placeholder for OTP sending logic
    // sendOtpToUser(phone, newOtp);
  };

  const handleVerifyOtp = () => {
    setLoadingButton(true);

    if (!otp) {
      setLoadingButton(false);
      alert("Please enter the OTP sent to your phone.");

      return;
    }
    if (otp === generatedOtp) {
      setLoadingButton(false);
      router.push("/auth/profile-setup");
    } else {
      setLoadingButton(false);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card normal-container">
        <AuthHeader
          heading="Verify Your Account"
          subHeading="Enter the OTP sent to your email or phone to confirm your account and start your journey with Nexario."
        />

        <div className="auth-form">
          <div className="mb-0">
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
        </div>

        <div className="auth-form">
          <p className="text-center mb-4 text-[#A1A1A1] forgot-text">
            Enter the OTP received on your entered email or phone number
          </p>
          <button
            className={`auth-button ${loadingButton ? "disable-button" : ""}`}
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
        </div>
      </div>
    </div>
  );
}

export default Page;
