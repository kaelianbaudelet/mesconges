"use server";

import { prisma } from "@/lib/prisma";

export async function createCampaign(
  startDate: string,
  endDate: string,
  startWishSelection: string,
  endWishSelection: string
) {
  const existingCampaign = await prisma.campaign.findFirst();
  if (existingCampaign) {
    throw new Error("Une campagne existe déjà.");
  }
  const campaign = await prisma.campaign.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startWishSelection: new Date(startDate), // Add appropriate value
      endWishSelection: new Date(endDate), // Add appropriate value
    },
  });

  return campaign;
}
