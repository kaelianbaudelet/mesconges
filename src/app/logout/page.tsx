"use client";

import { useEffect } from "react";
import { logout } from "@/app/actions/logout";

const LogoutPage = () => {
  useEffect(() => {
    logout();
    window.location.href = `https://www.identite.leclerc/login/signout`;
  }, []);

  return null;
};

export default LogoutPage;
