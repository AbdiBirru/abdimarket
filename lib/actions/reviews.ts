"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  if (rating < 1 || rating > 5) {
    return { error: "Please select a rating." };
  }

  if (!comment.trim()) {
    return { error: "Please write a comment." };
  }

  await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { rating, comment },
    create: { userId: session.user.id, productId, rating, comment },
  });

  return { success: true };
}
