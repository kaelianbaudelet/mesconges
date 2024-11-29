"use client";

import { useEffect } from "react";
import { logout } from "@/app/actions/logout";

const LogoutPage = () => {
  useEffect(() => {
    logout();
    setTimeout(() => {
      window.location.href = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${window.location.origin}`;
      window.close();
    }, 2000);
  }, []);

  return null;
};

export default LogoutPage;
