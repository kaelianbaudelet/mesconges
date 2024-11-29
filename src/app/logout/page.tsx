"use client";

import { useEffect } from "react";
import { logout } from "@/app/actions/logout";

const LogoutPage = () => {
  useEffect(() => {
    logout();
    setTimeout(() => {
      window.location.href = `https://www.identite.leclerc/login/signout`;
      window.close();
    }, 2000);
  }, []);

  return null;
};

export default LogoutPage;
