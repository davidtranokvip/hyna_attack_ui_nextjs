"use client";
import { useAuth } from "@/shared/lib/auth";
import Link from "next/link";
import React from "react";

const HeaderAttack = () => {

  const { user } = useAuth();
  return (
      <div className="">
        <div className="float-end">
          {user?.isAdmin ? (
            <Link href="/profile" className="flex items-center">
              <h2 className="mb-0 text-white text-2xl font-extrabold hover:text-primary transition-all">
                {user?.nameAccount.toUpperCase()}
              </h2>
            </Link>
          ) : (
            <h2 className="mb-0 text-white text-2xl font-extrabold">
              {user?.nameAccount.toUpperCase()}
            </h2>
          )}
        </div>
      </div>
  );
};

export default HeaderAttack;
