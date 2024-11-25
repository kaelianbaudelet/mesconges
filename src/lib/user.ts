import { prisma } from "@/lib/prisma";

export async function createUser(
  googleId: string,
  email: string,
  name: string,
  firstName: string,
  lastName: string,
  picture: string
): Promise<User> {
  const row = await prisma.user.create({
    data: {
      googleId,
      email,
      name,
      picture,
      firstName,
      lastName,
    },
    select: {
      id: true,
      googleId: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      role: true,
      picture: true,
    },
  });
  if (row === null) {
    throw new Error("Unexpected error");
  }
  const user: User = {
    id: row.id,
    googleId: String(row.googleId),
    email: String(row.email),
    name: String(row.name),
    firstName: String(row.firstName),
    lastName: String(row.lastName),
    role: String(row.role),
    picture: String(row.picture),
  };
  return user;
}

export async function getUserFromGoogleId(
  googleId: string
): Promise<User | null> {
  const row = await prisma.user.findUnique({
    where: { googleId },
    select: {
      id: true,
      googleId: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      role: true,
      picture: true,
    },
  });
  if (row === null) {
    return null;
  }
  const user: User = {
    id: row.id,
    googleId: String(row.googleId),
    email: String(row.email),
    name: String(row.name),
    firstName: String(row.firstName),
    lastName: String(row.lastName),
    role: String(row.role),
    picture: String(row.picture),
  };
  return user;
}

export interface User {
  id?: string;
  email: string;
  googleId: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  picture: string;
}
