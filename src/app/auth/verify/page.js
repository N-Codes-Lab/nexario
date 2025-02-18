"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useState } from "react";
function page() {
  return (
    <div className="auth-container">
      <div className="auth-card normal-container">
        <AuthHeader
          heading="Verify Your Account"
          subHeading="Enter the OTP sent to your email or phone to confirm your account and start your journey with Nexario."
        />

        <div className="auth-form">
          <div className="mb-0">
            <label htmlFor="email">Enter OTP</label>
            <div className="flex input-container normal-container">
              <input type="text" placeholder="XXXX" id="email" />
            </div>
          </div>
        </div>
        <div className="auth-form">
          {" "}
          <p className="text-center mb-4 text-[#A1A1A1] forgot-text">
            Enter the otp received on your enterred email or phone number
          </p>
          <button className="auth-button">Verify</button>
        </div>
      </div>
    </div>
  );
}

export default page;
