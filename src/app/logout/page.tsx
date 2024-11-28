"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { logout } from "@/app/actions/logout";

const LogoutPage = () => {
  useEffect(() => {
    logout();
    window.location.href =
      "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/";
  }, []);

  return null;
};

export default LogoutPage;
