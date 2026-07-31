import { prisma } from "./prisma";

export async function getProductReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return { reviews, averageRating, count: reviews.length };
}

export async function getUserReviewForProduct(userId: string | undefined, productId: string) {
  if (!userId) return null;
  return prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}
