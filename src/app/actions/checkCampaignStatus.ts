"use server";
// app/actions/checkCampaignStatus.ts
import { prisma } from "@/lib/prisma";

export async function checkCampaignStatus(): Promise<boolean> {
  const existingCampaign = await prisma.campaign.findFirst();
  return Boolean(existingCampaign);
}
