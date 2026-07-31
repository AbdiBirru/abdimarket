"use server";

import { getCouponDiscount } from "@/lib/coupons";

export async function applyCoupon(code: string, subtotal: number) {
  return getCouponDiscount(code, subtotal);
}
