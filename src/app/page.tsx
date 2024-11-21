"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Content from "@/components/ui/content";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <Content />;
}
