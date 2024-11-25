"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function deleteCampaign() {
  // Récupérer la première campagne existante
  const campaign = await prisma.campaign.findFirst();
  if (!campaign) {
    throw new Error("Aucune campagne à supprimer.");
  }

  // Récupérer les ID de tous les vœux associés à cette campagne
  const wishIds = await prisma.wish
    .findMany({
      where: { campaignId: campaign.id },
      select: { id: true },
    })
    .then((wishes: { id: string }[]) => wishes.map((wish) => wish.id));

  // Supprimer toutes les dates liées aux vœux des utilisateurs
  await prisma.wishDate.deleteMany({
    where: {
      OR: [
        { wish1Id: { in: wishIds } },
        { wish2Id: { in: wishIds } },
        { wish3Id: { in: wishIds } },
      ],
    },
  });

  // Supprimer ensuite tous les vœux associés à la campagne
  await prisma.wish.deleteMany({
    where: {
      campaignId: campaign.id,
    },
  });

  // Enfin, supprimer la campagne elle-même
  const deletedCampaign = await prisma.campaign.delete({
    where: {
      id: campaign.id,
    },
  });

  // Revalidation de la path "/"
  await revalidatePath("/");

  return deletedCampaign; // Retourner la campagne supprimée
}
