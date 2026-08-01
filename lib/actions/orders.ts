"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma";

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

type StatusResult = { error: string } | { success: true };

const VALID_STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<StatusResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Not authorized." };
  }

  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    return { error: "Invalid status." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}
