import React from "react";
import logo from "@/assets/logo.svg";
import Image from "next/image";

function AuthHeader({ heading, subHeading }) {
  return (
    <div className="auth-header w-full ">
      <div className="flex justify-center items-center my-8">
        <Image src={logo} alt="Logo" width={50} height={50} />
      </div>
      <h1>{heading}</h1>
      <p>{subHeading}</p>
    </div>
  );
}

export default AuthHeader;
