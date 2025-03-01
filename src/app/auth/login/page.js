"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useState } from "react";
import Image from "next/image";
import emailIcon from "@/assets/email.svg";
import pinIcon from "@/assets/pin.svg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import googleIcon from "@/assets/googleIcon.svg";
import facebookIcon from "@/assets/facebookIcon.svg";
import {
  auth,
  facebookProvider,
  googleProvider,
} from "@/app/firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import axios from "axios";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    pin: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleButtonClick = async (buttonType) => {
    const audio = new Audio("/btn_audio.wav"); // Path from public folder
    audio.play().catch((err) => console.error("Audio play failed:", err));
    setLoadingButton(buttonType); // Set loading button
    if (buttonType === "login") {
      console.log(formData);

      try {
        // Step 1: Check if user exists
        const userResponse = await axios.post("/api/auth/check_user", {
          phone: formData.phone,
          pin: formData.pin,
        });

        if (!userResponse.data.success) {
          alert("User does not exist. Please sign up first.");
          setLoadingButton(null);
          return;
        }

        const user = userResponse.data.user; // Extract user details from response

        // Step 2: Verify auth pin
        if (user.auth_pin !== formData.pin) {
          alert("Incorrect PIN. Please try again.");
          setLoadingButton(null);
          return;
        }

        // Step 3: Log in using Firebase Authentication
        const email = `${user.phone}@nexario.com`;
        const password = "Nexario/*/3432*(####@!_+"; // Hardcoded password
        console.log("Logging in with email:", email);

        const userData = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Login Success:", userData.user);

        alert("Login successful!");
      } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred during login. Please try again.");
      } finally {
        setLoadingButton(null);
      }
    } else if (buttonType === "google") {
      // console.log("Google button clicked");

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Google Sign-In Success:", user);

        // Optionally, send user info to your backend
        const response = await axios.post("/api/auth/create_user", {
          uId: user.uid,
          full_name: user.displayName,
          email: user.email,
          avatar: "not-selected",
          auth_provider: "google",
          auth_pin: "",
          phone: "not-selected",
          gender: "not-selected",
          dob: new Date().toISOString().split("T")[0],
        });

        // console.log("✅ Success:", response.data);

        if (response.data.message === "User created") {
          // alert("User created successfully!");
          toast.success("User created successfully!");
          router.push("/auth/phone");
        } else {
          toast.success("Login successful!");
        }

        alert("Google sign-in successful!");
      } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        console.error(
          "❌ Error:",
          error.response ? error.response.data : error.message
        );
        // alert("Failed to sign in with Google.");
        toast.error("Failed to sign in with Google." + error.message);
      } finally {
        setLoadingButton(null);
      }
      // Reset loading button
    } else {
      console.log("Facebook button clicked");

      try {
        // Step 1: Sign in with Facebook
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        console.log("Facebook Sign-In Success:", user);

        // Step 2: Optionally, send user info to your backend (MySQL Database)
        const response = await axios.post("/api/auth/create_user", {
          uId: user.uid,
          full_name: user.displayName,
          email: user.email,
          avatar: "not-selected",
          auth_provider: "facebook",
          auth_pin: "", // You can choose not to use this for Facebook login
          phone: "not-selected", // Facebook doesn't provide a phone number by default
          gender: "not-selected", // You can handle gender manually or with Facebook data if you want
          dob: new Date().toISOString().split("T")[0], // Use today's date or any available data
        });

        if (response.data.message === "User created") {
          toast.success("User created successfully!");
          router.push("/auth/phone"); // Redirect to phone verification or another step
          // alert("User created successfully!");
        } else {
          // alert("Error: Could not create user in the system.");
          toast.success("Login successful!");
        }
      } catch (error) {
        console.error("Facebook Sign-In Error:", error.message);
        toast.error("Failed to sign in with Facebook." + error.message);
        console.error(
          "❌ Error:",
          error.response ? error.response.data : error.message
        );
        // alert("Failed to sign in with Facebook.");
      } finally {
        setLoadingButton(null); // Reset loading button
      }

      setLoadingButton(null); // Reset loading button
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <AuthHeader
          heading="Welcome Back"
          subHeading="Sign in to play, win, and cash out!"
        />
        <Toaster />
        <div className="auth-form">
          <div className="mb-4 animate__animated animate__fadeInUp">
            <label htmlFor="phone">Phone number</label>
            <div className="flex input-container">
              <Image
                src={emailIcon}
                className="input-image"
                alt="Email"
                width={20}
                height={20}
              />
              <input
                type="tel"
                maxLength={10}
                placeholder="johndoe@email.com"
                id="phone"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-2 animate__animated animate__fadeInUp">
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
                maxLength={4}
                onChange={handleInputChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white transition animate__animated animate__fadeInUp"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4 auth-form-2 animate__animated animate__fadeInUp">
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
          <Link href="/auth/forgot-pin" className="text-white forgot-text">
            {" "}
            Forgot Pin?
            <span className="text-[#346af7] font-medium"> Change Now</span>
          </Link>
        </div>
        <div className="auth-form animate__animated animate__fadeInUp">
          {" "}
          <button
            className={`auth-button animate__animated animate__fadeInUp ${
              loadingButton === "login" ? "disable-button" : ""
            }`}
            disabled={loadingButton !== null}
            onClick={() => handleButtonClick("login")}
          >
            {loadingButton === "login" ? (
              <div className="spinner center">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          <p className="text-center  mt-[40px] text-white forgot-text animate__animated animate__fadeInUp">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#346af7] font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <div className="divider-container animate__animated animate__fadeInUp">
          <div className="divider"></div>
          <p className="text-white">or continue with</p>
          <div className="divider"></div>
        </div>

        <div className="auth-button-container flex gap-4 animate__animated animate__fadeInUp">
          <button
            className="auth-button-or animate__animated animate__fadeInUp"
            disabled={loadingButton !== null}
            onClick={() => handleButtonClick("google")}
          >
            {loadingButton === "google" ? (
              <div className="spinner center">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            ) : (
              <>
                <Image src={googleIcon} alt="google" width={20} height={20} />
                Google
              </>
            )}
          </button>
          <button
            className="auth-button-or animate__animated animate__fadeInUp"
            disabled={loadingButton !== null}
            onClick={() => handleButtonClick("facebook")}
          >
            {loadingButton === "facebook" ? (
              <div className="spinner center">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            ) : (
              <>
                <Image
                  src={facebookIcon}
                  alt="facebook"
                  width={20}
                  height={20}
                />{" "}
                Facebook
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default page;
