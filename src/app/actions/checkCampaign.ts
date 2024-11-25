"use server";
// app/actions/checkCampaignStatus.ts
import { prisma } from "@/lib/prisma";

export async function checkCampaign(): Promise<boolean> {
  const currentDate = new Date();

  // Rechercher une campagne active dont la date actuelle est entre startDate et endDate
  const existingCampaign = await prisma.campaign.findFirst({
    where: {
      startDate: { lte: currentDate }, // startDate est inférieur ou égal à la date actuelle
      endDate: { gte: currentDate }, // endDate est supérieur ou égal à la date actuelle
    },
  });

  // Retourner true si une campagne valide existe, sinon false
  return Boolean(existingCampaign);
}
