"use client";
import { useAuth } from "@/shared/lib/auth";
import React from "react";

const HeaderAttack = () => {

  const { user } = useAuth();
  return (
      <div className="">
        <div className="float-end"><h2 className="mb-0 text-white text-2xl font-extrabold">{user?.nameAccount.toUpperCase()}</h2></div>
      </div>

  );
};

export default HeaderAttack;
