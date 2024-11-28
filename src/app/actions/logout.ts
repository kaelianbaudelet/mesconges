"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/session";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await getCurrentSession();
  if (session === null) {
    // Si aucune session n'est trouvée, on ne fait rien
    return;
  }
  invalidateSession(session.id);
  deleteSessionTokenCookie();
  return redirect("/login");
}
