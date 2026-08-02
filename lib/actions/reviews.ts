"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations/review";

type ReviewResult = { error: string } | { success: true };

export async function submitReview(
  productId: string,
  rating: number,
  comment: string
): Promise<ReviewResult> {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be logged in to leave a review." };
  }

  const result = reviewSchema.safeParse({ rating, comment });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { rating: result.data.rating, comment: result.data.comment },
    create: {
      userId: session.user.id,
      productId,
      rating: result.data.rating,
      comment: result.data.comment,
    },
  });

  return { success: true };
}
