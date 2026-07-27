import { prisma } from "./prisma";

export async function getWishlistedProductIds(userId?: string): Promise<Set<string>> {
  if (!userId) return new Set();
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}

export async function isProductWishlisted(
  userId: string | undefined,
  productId: string
): Promise<boolean> {
  if (!userId) return false;
  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!item;
}
