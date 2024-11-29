"use client";

import { useEffect } from "react";
import { logout } from "@/app/actions/logout";

const LogoutPage = () => {
  useEffect(() => {
    logout();

    window.open("https://www.identite.leclerc/login/signout", "_blank");

    window.location.href = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${window.location.origin}`;
  }, []);

  return null;
};

export default LogoutPage;
