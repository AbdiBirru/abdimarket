import { prisma } from "./prisma";

type CouponResult =
  | { error: string }
  | { code: string; discountAmount: number };

export async function getCouponDiscount(
  code: string,
  subtotal: number
): Promise<CouponResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.active) {
    return { error: "Invalid coupon code." };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { error: "This coupon has expired." };
  }

  const discountValue = Number(coupon.discountValue);
  const discountAmount =
    coupon.discountType === "PERCENTAGE"
      ? subtotal * (discountValue / 100)
      : Math.min(discountValue, subtotal);

  return { code: coupon.code, discountAmount };
}
