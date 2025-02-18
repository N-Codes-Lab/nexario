"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useState } from "react";
import Image from "next/image";
import emailIcon from "@/assets/email.svg";
import pinIcon from "@/assets/pin.svg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import googleIcon from "@/assets/googleIcon.svg";
import facebookIcon from "@/assets/facebookIcon.svg";
function page() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthHeader
          heading="Welcome Back"
          subHeading="Sign in to play, win, and cash out!"
        />

        <div className="auth-form">
          <div className="mb-4">
            <label htmlFor="email">Email or Phone number</label>
            <div className="flex input-container">
              <Image
                src={emailIcon}
                className="input-image"
                alt="Email"
                width={20}
                height={20}
              />
              <input type="text" placeholder="johndoe@email.com" id="email" />
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="pin">Enter Your account pin</label>
            <div className="flex input-container">
              <Image
                src={pinIcon}
                className="input-image"
                alt="pin"
                width={20}
                height={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="****"
                id="pin"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white transition"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4 auth-form-2">
          <div className="flex cursor-pointer">
            <input
              className="check-input"
              type="checkbox"
              name="rememberme"
              id="rememberme"
            />
            <label htmlFor="rememberme" className="ml-2 text-white">
              Remember me
            </label>
          </div>
          <a href="#" className="text-white forgot-text">
            Forgot Pin?
            <span className="text-[#346af7] font-medium"> Change Now</span>
          </a>
        </div>
        <div className="auth-form">
          {" "}
          <button className="auth-button">Sign in</button>
          <p className="text-center mt-4 text-white forgot-text">
            Don't have an account?{" "}
            <a href="#" className="text-[#346af7] font-medium">
              Sign up
            </a>
          </p>
        </div>

        <div className="divider-container">
          <div className="divider"></div>
          <p className="text-white">or continue with</p>
          <div className="divider"></div>
        </div>

        <div className="auth-button-container">
          <button className="auth-button-or">
            <Image src={googleIcon} alt="google" width={26} height={26} />{" "}
            Google
          </button>
          <button className="auth-button-or">
            {" "}
            <Image
              src={facebookIcon}
              alt="google"
              width={26}
              height={26}
            />{" "}
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default page;
