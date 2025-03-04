"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Page() {
  const [uId, setUId] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const updatePhoneNumber = async () => {
    const audio = new Audio("/btn_audio.wav"); // Path from public folder
    audio.play().catch((err) => console.error("Audio play failed:", err));
    if (!formData.phone || !uId) {
      // alert("Please enter a phone number and ensure you are logged in.");
      toast.error("Please enter a phone number and ensure you are logged in.");
      return;
    }

    setLoadingButton(true);

    try {
      const response = await axios.post("/api/auth/update_phone", {
        uId,
        phone: formData.phone,
      });

      if (response.data.success) {
        // alert("Phone number updated successfully!");
        toast.success("Phone number updated successfully!");

        localStorage.setItem("phone", formData.phone);
        router.push("/auth/verify");
      } else {
        // alert("Failed to update phone number.");
        toast.error("Failed to update phone number.");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      // alert("An error occurred while updating the phone number.");
      toast.error("An error occurred while updating the phone number." + error);
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUId(user.uid);
      } else {
        toast.error("Please login to continue.");
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="auth-container">
      <Toaster />
      <div className="auth-card  fit-content-container">
        <AuthHeader
          heading="Enter Your Phone Number"
          subHeading="Enter your phone number to update it."
        />

        <div className="auth-form">
          <div className="mb-0 animate__animated animate__fadeInUp">
            <label htmlFor="phone">Enter Phone Number</label>
            <div className="flex input-container normal-container">
              <input
                type="text"
                placeholder="1234567890"
                id="phone"
                value={formData.phone}
                maxLength={10}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="auth-form animate__animated animate__fadeInUp">
          <button
            className={`auth-button mt-6 animate__animated animate__fadeInUp ${
              loadingButton ? "disable-button" : ""
            }`}
            onClick={updatePhoneNumber}
          >
            {loadingButton ? (
              <div className="spinner center">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
