"use server";
// app/actions/getCampaignStats.ts
import { prisma } from "@/lib/prisma";

export async function getCampaignStats() {
  // Récupérer le nombre total d'utilisateurs
  const totalUsers = await prisma.user.count();

  // Compter les utilisateurs ayant soumis au moins un vœu
  const usersWithWishes = await prisma.user.count({
    where: {
      wishes: {
        some: {},
      },
    },
  });

  // Calculer les utilisateurs sans souhaits
  const usersWithoutWishes = totalUsers - usersWithWishes;

  // Récupérer la campagne en cours (en supposant qu'une seule campagne active peut exister)
  const activeCampaign = await prisma.campaign.findFirst({
    orderBy: { startDate: "desc" },
  });

  return {
    totalUsers,
    usersWithWishes,
    usersWithoutWishes,
    campaignPeriod: activeCampaign
      ? {
          startDate: activeCampaign.startDate,
          endDate: activeCampaign.endDate,
        }
      : null,
  };
}
