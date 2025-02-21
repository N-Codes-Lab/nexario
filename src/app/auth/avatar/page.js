"use client";
import AuthHeader from "@/app/components/auth/AuthHeader";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Page() {
  const [uId, setUId] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUId(user.uid);
        fetchAvatars(user.uid, setAvatars);
      } else {
        toast.error("Please login to continue.");
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch avatars based on user's gender
  const fetchAvatars = async (userId, setAvatars) => {
    try {
      const response = await axios.post("/api/auth/get-avatars", {
        uId: userId,
      });

      if (response.data.success) {
        setAvatars(response.data.avatars);
        setIsNotLoaded(false);
      } else {
        toast.error(response.data.error || "Failed to load avatars.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching avatars.");
      console.error("Error fetching avatars:", error);
    }
  };

  // Select an avatar
  const handleAvatarClick = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
  };

  const saveAvatar = async () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar before confirming.");
      return;
    }

    setLoadingButton(true);

    try {
      const response = await axios.post("/api/auth/save-avatar", {
        uId,
        avatarUrl: selectedAvatar,
      });

      if (response.data.success) {
        toast.success("Avatar updated successfully!");
        setTimeout(() => {
          router.push("/"); // Redirect after success
        }, 1500);
      } else {
        toast.error(response.data.error || "Failed to update avatar.");
      }
    } catch (error) {
      toast.error("Something went wrong while saving avatar.");
      console.error("Error saving avatar:", error);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="auth-container">
      <Toaster />
      <div className="auth-card">
        <AuthHeader
          heading="Choose Your Avatar"
          subHeading="Pick a look that represents you in the Nexario community."
        />

        <div className="auth-form">
          <div className="flex avatars-container">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`avatar ${
                  selectedAvatar === avatar.avatar_url ? "selected" : ""
                }`}
                onClick={() => handleAvatarClick(avatar.avatar_url)}
              >
                <Image
                  src={avatar.avatar_url}
                  alt="Avatar"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        </div>
        {isNotLoaded ? (
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
          <div className="auth-form">
            <button
              className={`auth-button ${loadingButton ? "disable-button" : ""}`}
              onClick={saveAvatar}
              disabled={loadingButton}
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
        )}
      </div>
    </div>
  );
}

export default Page;
