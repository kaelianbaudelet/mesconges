"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const SignInPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) void signIn("google");
    if (session) window.close();
  }, [session, status]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p>Redirection en cours...</p>
    </div>
  );
};

export default SignInPage;
