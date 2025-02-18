"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useState } from "react";
function page() {
  return (
    <div className="auth-container">
      <div className="auth-card normal-container">
        <AuthHeader
          heading="Forgot Your Pin?"
          subHeading="Enter your email or phone number, and we'll send you a link to rest your pin securely."
        />

        <div className="auth-form">
          <div className="mb-0">
            <label htmlFor="email">Email or Phone Number</label>
            <div className="flex input-container normal-container">
              <input type="text" placeholder="johndoe@gmail.com" id="email" />
            </div>
          </div>
        </div>
        <div className="auth-form">
          {" "}
          <p className="text-center mb-4 text-[#A1A1A1] forgot-text">
            Provide the email or phone number linked to your account
          </p>
          <button className="auth-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default page;
