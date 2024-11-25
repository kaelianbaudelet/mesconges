"use server";
import { prisma } from "@/lib/prisma";
export async function getUserHolidayWishes() {
  return await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      wishes: {
        select: {
          id: true,
          familyStatus: true,
          childrenCount: true,
          campaign: {
            select: {
              startDate: true,
              endDate: true,
            },
          },
          wish1: {
            select: {
              date: true,
            },
          },
          wish2: {
            select: {
              date: true,
            },
          },
          wish3: {
            select: {
              date: true,
            },
          },
        },
      },
    },
  });
}
