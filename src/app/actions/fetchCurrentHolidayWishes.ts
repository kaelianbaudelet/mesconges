"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function fetchCurrentHolidayWishes() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Récupérer la campagne active
    const activeCampaign = await prisma.campaign.findFirst({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (!activeCampaign) {
      return null;
    }

    if (!session.user) {
      throw new Error("Unauthorized");
    }

    // Récupérer les vœux avec toutes les dates associées
    const wishes = await prisma.wish.findFirst({
      where: {
        userId: session.user.id,
        campaignId: activeCampaign.id,
      },
      include: {
        wish1: true,
        wish2: true,
        wish3: true,
      },
    });

    if (!wishes) {
      return null;
    }

    return {
      wish1Dates: wishes.wish1.map((w: { date: Date }) => w.date),
      wish2Dates: wishes.wish2.map((w: { date: Date }) => w.date),
      wish3Dates: wishes.wish3.map((w: { date: Date }) => w.date),
      childrenCount: wishes.childrenCount,
      familyStatus: wishes.familyStatus,
    };
  } catch (error) {
    console.error("Error fetching holiday wishes:", error);
    return null;
  }
}
