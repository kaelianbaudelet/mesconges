import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { createUser, getUserFromGoogleId } from "@/lib/user";
import { globalGETRateLimit } from "@/lib/request";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

interface GoogleClaims {
  sub: string;
  name: string;
  picture: string;
  email: string;
  family_name: string;
  given_name: string;
}

export async function GET(request: Request): Promise<Response> {
  if (!globalGETRateLimit()) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState =
    (await cookies()).get("google_oauth_state")?.value ?? null;
  const codeVerifier =
    (await cookies()).get("google_code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return redirect("/login?error=missing_code");
  }

  if (state !== storedState) {
    return redirect("/login?error=invalid_state");
  }

  let tokens: OAuth2Tokens;
  let claims: GoogleClaims;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
    claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
  } catch {
    return redirect("/login?error=invalid_code");
  }

  const googleId = claims["sub"];
  const name = claims["name"];
  const picture = claims["picture"];
  const email = claims["email"];
  const firstName = claims["given_name"];
  const lastName = claims["family_name"];

  if (
    typeof googleId !== "string" ||
    typeof name !== "string" ||
    typeof picture !== "string" ||
    typeof email !== "string"
  ) {
    return redirect("/login?error=invalid_claims");
  }

  const emailDomainWhitelist =
    process.env.EMAIL_DOMAIN_WHITELIST;
  if (!email.endsWith(emailDomainWhitelist)) {
    return redirect("/login?error=unauthorized");
  }

  const existingUser = await getUserFromGoogleId(googleId);
  if (existingUser !== null && typeof existingUser.id === "string") {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return redirect("/");
  }

  const user = await createUser(
    googleId,
    email,
    name,
    firstName,
    lastName,
    picture
  );
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id as string);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return redirect("/");
}
