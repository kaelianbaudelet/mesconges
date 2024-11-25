import { prisma } from "@/lib/prisma";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha3_512 } from "@oslojs/crypto/sha3";
import { cookies } from "next/headers";
import { cache } from "react";

import type { User } from "./user";

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(
    sha3_512(new TextEncoder().encode(token))
  );
  const row = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        select: {
          googleId: true,
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          role: true,
          picture: true,
        },
      },
    },
  });

  if (row === null) {
    return { session: null, user: null };
  }
  const session: Session = {
    id: row.id,
    userId: row.user.id,
    expiresAt: new Date(row.expiresAt),
  };
  const user: User = {
    id: row.user.id,
    email: row.user.email,
    googleId: row.user.googleId,
    name: row.user.name,
    firstName: row.user.firstName,
    lastName: row.user.lastName,
    role: row.user.role,
    picture: row.user.picture,
  };
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({
      where: { id: session.id },
    });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: session.expiresAt },
    });
  }
  return { session, user };
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = (await cookies()).get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  }
);

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId },
  });
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId: userId },
  });
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  (await cookies()).set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32(tokenBytes).toLowerCase();
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionId = encodeHexLowerCase(
    sha3_512(new TextEncoder().encode(token))
  );
  const session: Session = {
    id: sessionId,
    userId: userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await prisma.session.create({
    data: {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    },
  });
  return session;
}

export interface Session {
  id: string;
  expiresAt: Date;
  userId: string;
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
