"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleWishlist(productId: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "not-authenticated" as const };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { wishlisted: false };
  }

  await prisma.wishlistItem.create({
    data: { userId: session.user.id, productId },
  });
  return { wishlisted: true };
}
