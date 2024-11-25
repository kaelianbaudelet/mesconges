"use server";

import { getCurrentSession } from "@/lib/session";
import { globalGETRateLimit } from "@/lib/request";
import { redirect } from "next/navigation";
import Content from "@/components/ui/content";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default async function Page() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  return (
    <>
      <Navbar />
      <Content />
      <Footer />
    </>
  );
}
