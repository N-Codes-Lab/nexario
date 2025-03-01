"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import { auth } from "@/app/firebase/firebase";
import { DatePicker, Select } from "antd";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const { Option } = Select;

function Page() {
  const [date, setDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();
  const [uId, setUId] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  const updateDetails = async () => {
    if (!date || !selectedOption || !uId) {
      toast.error("Please fill all the fields.");
      return;
    }

    setLoadingButton(true);

    try {
      const response = await axios.post("/api/auth/update_details", {
        uId,
        dob: date,
        gender: selectedOption,
      });

      if (response.data.success) {
        // alert("Details updated successfully!");
        toast.success("Details updated successfully!");
        router.push("/auth/avatar");
      } else {
        // alert("Failed to update details.");
        toast.error("Failed to update details.");
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
        toast.error("User not found.");
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="auth-container relative overflow-hidden">
      <Toaster />
      <div className="auth-card normal-container">
        <AuthHeader
          heading="Tell Us About Yourself"
          subHeading="Enter your email or phone number, and we'll send you a link to reset your pin securely."
        />

        <div className="auth-form">
          {/* Date of Birth */}
          <div className="mb-0 animate__animated animate__fadeInUp">
            <label htmlFor="email">Date of Birth</label>
            <div className="flex input-container normal-container">
              <DatePicker
                size="medium"
                onChange={(date, dateString) => setDate(dateString)}
                style={{ width: "100%", marginBottom: 20 }}
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mb-0 animate__animated animate__fadeInUp">
            <label htmlFor="gender">Select your gender</label>
            <div className="flex input-container normal-container">
              <Select
                className="gender-select"
                size="large"
                placeholder="Select your gender"
                onChange={(value) => setSelectedOption(value)}
                style={{ width: "100%" }}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </div>
          </div>
          <p className="text-center mt-4 text-[#A1A1A1] forgot-text">
            Provide the DOB and gender to set up your profile
          </p>
        </div>

        <div className="auth-form animate__animated animate__fadeInUp">
          <button
            className={`auth-button ${loadingButton ? "disable-button" : ""}`}
            onClick={updateDetails}
          >
            {loadingButton ? (
              <div className="spinner center">
                <div className="spinner-blade"></div>
                <div className="spinner-blade"></div>
              </div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
