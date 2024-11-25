"use server";

import { getCurrentSession } from "@/lib/session";
import type { User } from "@/lib/user";

export async function fetchUser(): Promise<User | null> {
  const sessionResult = await getCurrentSession();
  return sessionResult ? sessionResult.user : null;
}
