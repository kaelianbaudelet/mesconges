"use server";

import { getCurrentSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

interface WishFormData {
  childrenCount: number;
  familyStatus: string;
  wish1Dates: Date[];
  wish2Dates: Date[];
  wish3Dates: Date[];
}

export async function saveHolidayWishes(data: WishFormData) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.user) {
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
      throw new Error("Aucune campagne active");
    }

    // Vérifier si l'utilisateur a déjà des vœux pour cette campagne
    const existingWish = await prisma.wish.findFirst({
      where: {
        userId: session.user.id,
        campaignId: activeCampaign.id,
      },
    });

    if (existingWish) {
      // Mettre à jour les vœux existants
      // D'abord, supprimer toutes les dates existantes
      await prisma.wishDate.deleteMany({
        where: {
          OR: [
            { wish1Id: existingWish.id },
            { wish2Id: existingWish.id },
            { wish3Id: existingWish.id },
          ],
        },
      });

      // Mettre à jour le souhait principal
      await prisma.wish.update({
        where: { id: existingWish.id },
        data: {
          childrenCount: data.childrenCount,
          familyStatus:
            data.familyStatus === "isolated" ? "isolated" : "family",
        },
      });

      // Créer les nouvelles dates
      await Promise.all([
        ...data.wish1Dates.map((date: Date) =>
          prisma.wishDate.create({
            data: {
              date,
              wish1Id: existingWish.id,
            },
          })
        ),
        ...data.wish2Dates.map((date: Date) =>
          prisma.wishDate.create({
            data: {
              date,
              wish2Id: existingWish.id,
            },
          })
        ),
        ...data.wish3Dates.map((date: Date) =>
          prisma.wishDate.create({
            data: {
              date,
              wish3Id: existingWish.id,
            },
          })
        ),
      ]);
    } else {
      // Créer un nouveau souhait
      if (!session.user.id) {
        throw new Error("User ID is undefined");
      }

      const wish = await prisma.wish.create({
        data: {
          userId: session.user.id,
          campaignId: activeCampaign.id,
          childrenCount: data.childrenCount,
          familyStatus:
            data.familyStatus === "isolated" ? "isolated" : "family",
        },
      });

      // Créer les dates pour chaque vœu
      await Promise.all([
        ...data.wish1Dates.map((date: Date) =>
          prisma.wishDate.create({
            data: {
              date,
              wish1Id: wish.id,
            },
          })
        ),
        ...data.wish2Dates.map((date: Date) =>
          prisma.wishDate.create({
            data: {
              date,
              wish2Id: wish.id,
            },
          })
        ),
        ...data.wish3Dates.map((date: Date) =>
          prisma.wishDate.create({
            data: {
              date,
              wish3Id: wish.id,
            },
          })
        ),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error saving holiday wishes:", error);
    return { success: false, error: (error as Error).message };
  }
}
