"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ConfirmResult = { error: string } | { success: true };

export async function confirmSimulatedPayment(orderId: string): Promise<ConfirmResult> {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be logged in." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    return { error: "Order not found." };
  }

  if (order.status !== "PENDING") {
    return { error: "This order has already been processed." };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    }),
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);

  return { success: true };
}
