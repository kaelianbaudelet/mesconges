"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUsers(userIds: string[]) {
  try {
    if (!userIds.length) {
      throw new Error("No users selected");
    }
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    revalidatePath("/"); // Ajustez le chemin selon votre route
    return {
      success: true,
      message: `${userIds.length} utilisateurs supprimés avec succès`,
    };
  } catch {
    return { error: "Échec de la suppression des utilisateurs: " };
  }
}
