"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function ForgotPinPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const [newPin, setNewPin] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();
  // Function to check if user exists
  const checkUserExists = async () => {
    if (phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    setLoadingButton(true);

    try {
      const response = await fetch("/api/auth/check-forgot-pin-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (data.exists) {
        setUserExists(true);

        // Generate 4-digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000);
        setGeneratedOtp(otpCode);
        console.log("Generated OTP:", otpCode);
        toast.success("OTP sent successfully!" + otpCode);
        setLoadingButton(false);
        // TODO: Implement OTP sending logic here
      } else {
        // alert("User not found!");
        toast.error("User not found!");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Internal server error" + error);
      setLoadingButton(false);
    }
  };

  // Function to verify OTP and update auth_pin
  const verifyOtpAndUpdatePin = async () => {
    if (otp.length !== 4) {
      toast.error("OTP must be 4 digits");
      return;
    }

    if (parseInt(otp) === generatedOtp) {
      setOtpVerified(true);
      try {
        const response = await fetch("/api/auth/update-pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, newPin }),
        });

        const data = await response.json();
        if (data.success) {
          // alert("Pin updated successfully!");
          setLoadingButton(false);
          toast.success("Pin updated successfully!");
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        } else {
          // alert("Failed to update PIN");
          toast.error("Failed to update PIN");
          setLoadingButton(false);
        }
      } catch (error) {
        console.error("Error updating PIN:", error);
        toast.error("Internal server error" + error);
        setLoadingButton(false);
      }
    } else {
      // alert("Incorrect OTP!");
      toast.error("Incorrect OTP!");
      setLoadingButton(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card normal-container">
        <Toaster />
        <AuthHeader
          heading="Forgot Your Pin?"
          subHeading="Enter your phone number."
        />

        <div className="auth-form">
          {!userExists ? (
            <>
              <label htmlFor="phone">Phone Number</label>
              <div className="flex input-container normal-container">
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter phone number"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <p className="text-center mt-3 text-[#A1A1A1] forgot-text">
                Provide the phone number linked to your account
              </p>
              <button
                className={`auth-button mt-3 ${
                  loadingButton ? "disable-button" : ""
                }`}
                onClick={checkUserExists}
              >
                {loadingButton ? (
                  <div className="spinner center">
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : (
            <>
              <label htmlFor="otp">OTP</label>
              <div className="flex input-container normal-container mb-2">
                <input
                  type="tel"
                  maxLength={4}
                  placeholder="XXXX"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <label htmlFor="pin">New Pin</label>
              <div className="flex input-container normal-container mb-2">
                <input
                  type="tel"
                  maxLength={4}
                  placeholder="XXXX"
                  id="pin"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                />
              </div>

              <button
                className={`auth-button mt-4 ${
                  loadingButton ? "disable-button" : ""
                }`}
                onClick={verifyOtpAndUpdatePin}
              >
                {loadingButton ? (
                  <div className="spinner center">
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                  </div>
                ) : (
                  "Verify & Update PIN"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPinPage;
