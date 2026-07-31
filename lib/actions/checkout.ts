"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCouponDiscount } from "@/lib/coupons";

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

type CheckoutResult = { error: string } | { url: string };

export async function createCheckoutSession(
  items: CartItemInput[],
  shipping: ShippingInput,
  couponCode?: string
): Promise<CheckoutResult> {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be logged in to check out." };
  }

  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let total = subtotal;
  let appliedCouponCode: string | null = null;

  if (couponCode) {
    const discount = await getCouponDiscount(couponCode, subtotal);
    if (!("error" in discount)) {
      total = Math.max(0, subtotal - discount.discountAmount);
      appliedCouponCode = discount.code;
    }
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      total,
      couponCode: appliedCouponCode,
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
