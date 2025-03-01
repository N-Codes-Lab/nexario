"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useState } from "react";
import Image from "next/image";
import emailIcon from "@/assets/email.svg";
import userIcon from "@/assets/userIcon.svg";
import pinIcon from "@/assets/pin.svg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import googleIcon from "@/assets/googleIcon.svg";
import facebookIcon from "@/assets/facebookIcon.svg";
import {
  auth,
  facebookProvider,
  googleProvider,
} from "@/app/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null); // Track which button is clicked
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
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
    if (buttonType === "signup") {
      if (
        !formData.full_name ||
        !formData.email ||
        !formData.phone ||
        !formData.pin
      ) {
        toast.error("Please fill all fields.");
        setLoadingButton(null); // Reset loading button
        return;
      } else {
        const email = `${formData.phone}@nexario.com`;
        const password = "Nexario/*/3432*(####@!_+";
        try {
          // Step 1: Create user in Firebase
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const uId = userCredential.user.uid;
          // console.log("User created successfully:", uId);

          // Step 2: Save user in MySQL database
          await axios.post("/api/auth/create_user", {
            uId,
            full_name: formData.full_name,
            phone: formData.phone,
            email: formData.email,
            auth_pin: formData.pin,
            avatar: "not-selected",
            dob: new Date().toISOString().split("T")[0],
            gender: "not-selected",
            auth_provider: "phone",
          });

          toast.success("Account created successfully!");
          localStorage.setItem("phone", formData.phone);
          router.push("/auth/verify");
          setLoadingButton(null); // Reset loading button
        } catch (error) {
          console.error("Error:", error.message);
          toast.error("Failed to create user. " + error.message);
          // alert("Failed to create user.");
          setLoadingButton(null); // Reset loading button
        } finally {
          setLoadingButton(null);
        }
      }
    } else if (buttonType === "google") {
      // console.log("Google button clicked");

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // console.log("Google Sign-In Success:", user);

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
          toast.success("Account created successfully!");
          router.push("/auth/phone");
        } else {
          toast.success("login successfully!");
        }
      } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        toast.error("Failed to sign in with Google. " + error.message);
        console.error(
          "❌ Error:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoadingButton(null);
      }
      // Reset loading button
    } else {
      // console.log("Facebook button clicked");

      try {
        // Step 1: Sign in with Facebook
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        // console.log("Facebook Sign-In Success:", user);

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
          toast.success("Account created successfully!");
          router.push("/auth/phone"); // Redirect to phone verification or another step
        } else {
          toast.success("login successfully!");
        }
      } catch (error) {
        console.error("Facebook Sign-In Error:", error.message);
        toast.error("Failed to sign in with Facebook. " + error.message);
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
      <Toaster />
      <div className="auth-card">
        <AuthHeader
          heading="Get Started Now"
          subHeading="Sign up to play, win, and cash out with ease!"
        />

        <div className="auth-form animate__animated animate__fadeInUp">
          <div className="mb-4 animate__animated animate__fadeInUp">
            <label htmlFor="full_name">Enter your full name</label>
            <div className="flex input-container">
              <Image
                src={userIcon}
                className="input-image"
                alt="full_name"
                width={20}
                height={20}
              />
              <input
                type="text"
                onChange={handleInputChange}
                placeholder="John Doe"
                id="full_name"
              />
            </div>
          </div>
          <div className="mb-4 animate__animated animate__fadeInUp">
            <label htmlFor="email">Email</label>
            <div className="flex input-container">
              <Image
                src={emailIcon}
                className="input-image"
                alt="Email"
                width={20}
                height={20}
              />
              <input
                type="text"
                onChange={handleInputChange}
                placeholder="johndoe@email.com"
                id="email"
              />
            </div>
          </div>
          <div className="mb-4 animate__animated animate__fadeInUp">
            <label htmlFor="phone">Phone number</label>
            <div className="flex input-container">
              <Image
                src={emailIcon}
                className="input-image"
                alt="phone"
                width={20}
                height={20}
              />
              <input
                type="tel"
                maxLength={10}
                onChange={handleInputChange}
                placeholder="XXXXXXXXXX"
                id="phone"
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
                maxLength={4}
                onChange={handleInputChange}
                id="pin"
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

        <div className="auth-form animate__animated animate__fadeInUp">
          <button
            className={`auth-button  ${
              loadingButton === "signup" ? "disable-button" : ""
            }`}
            disabled={loadingButton !== null}
            onClick={() => handleButtonClick("signup")}
          >
            {loadingButton === "signup" ? (
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
              "Sign Up"
            )}
          </button>
          <p className="text-center mt-[40px] text-white forgot-text">
            Already have an account?{" "}
            <Link className="text-[#346af7] font-medium" href="/auth/login">
              Sign in
            </Link>
          </p>
        </div>

        <div className="divider-container animate__animated animate__fadeInUp">
          <div className="divider"></div>
          <p className="text-white">or continue with</p>
          <div className="divider"></div>
        </div>

        <div className="auth-button-container animate__animated animate__fadeInUp flex gap-4">
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
            className="auth-button-or animate__animated animate__fadeInUp "
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

export default Page;
