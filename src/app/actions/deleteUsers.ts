"use server";

import { prisma } from "@/lib/prisma";

export async function deleteUsers(userIds: string[]) {
  if (!userIds.length) {
    throw new Error("Aucun utilisateur à supprimer.");
  }

  // Récupérer les IDs de tous les vœux associés à ces utilisateurs
  const wishIds = await prisma.wish
    .findMany({
      where: { userId: { in: userIds } },
      select: { id: true },
    })
    .then((wishes) => wishes.map((wish) => wish.id));

  // Supprimer toutes les dates associées aux vœux des utilisateurs
  await prisma.wishDate.deleteMany({
    where: {
      OR: [
        { wish1Id: { in: wishIds } },
        { wish2Id: { in: wishIds } },
        { wish3Id: { in: wishIds } },
      ],
    },
  });

  // Supprimer ensuite tous les vœux des utilisateurs
  await prisma.wish.deleteMany({
    where: { userId: { in: userIds } },
  });

  // Supprimer enfin les utilisateurs eux-mêmes
  await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  return {
    success: `${userIds.length} utilisateurs et leurs données associées ont été supprimés.`,
  };
}
