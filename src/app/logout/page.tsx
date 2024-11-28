"use client";

import { useEffect } from "react";
import { logout } from "@/app/actions/logout";

const LogoutPage = () => {
  useEffect(() => {
    logout();
    window.location.href = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${process.env.SITE_URL}`;
  }, []);

  return null;
};

export default LogoutPage;
