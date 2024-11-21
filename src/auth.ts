import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //async signIn({ account, profile }) {
    //  if (account?.provider === "google") {
    //    if (profile?.email?.endsWith("@scapartois.leclerc")) {
    //      return true;
    //    }
    //    return false;
    //  }
    //  return true;
    //},
    async signIn({ profile }) {
      if (!profile?.email) return false;
      const user = await prisma.user.findUnique({
        where: { email: profile.email },
      });
      return !!user;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
