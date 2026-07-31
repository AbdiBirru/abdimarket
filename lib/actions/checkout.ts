"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CartItemInput = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ShippingInput = {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode: string;
};

export async function createCheckoutSession(
  items: CartItemInput[],
  shipping: ShippingInput
) {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be logged in to check out." };
  }

  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      total,
      shippingName: shipping.fullName,
      shippingPhone: shipping.phone,
      shippingAddress: shipping.addressLine1,
      shippingCity: shipping.city,
      shippingPostalCode: shipping.postalCode,
      items: {
        create: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
      },
    },
  });

  return { url: `/checkout/simulate?orderId=${order.id}` };
}
