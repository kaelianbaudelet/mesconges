// app/login/page.tsx
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { globalGETRateLimit } from "@/lib/request";
import LoginForm from "@/components/ui/login-form";

export default async function LoginPage() {
  if (!globalGETRateLimit()) {
    return <div>Too many requests</div>;
  }

  const session = await getCurrentSession();

  if (session.user !== null) {
    redirect("/");
  }

  return <LoginForm />;
}
