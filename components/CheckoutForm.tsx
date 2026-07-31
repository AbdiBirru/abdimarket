"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { shippingSchema } from "@/lib/validations/checkout";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { applyCoupon } from "@/lib/actions/coupons";

export default function CheckoutForm() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!hasHydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink/70">Add something to your cart before checking out.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = appliedCoupon ? Math.max(0, subtotal - appliedCoupon.discountAmount) : subtotal;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");

    const result = await applyCoupon(couponCode, subtotal);

    setIsApplyingCoupon(false);

    if ("error" in result) {
      setCouponError(result.error ?? "Invalid coupon code.");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(result);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const result = shippingSchema.safeParse({
      fullName,
      phone,
      addressLine1,
      city,
      postalCode,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const response = await createCheckoutSession(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      result.data,
      appliedCoupon?.code
    );

    if ("error" in response) {
      setSubmitError(response.error ?? "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = response.url;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Street address"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
            {errors.addressLine1 && <p className="mt-1 text-xs text-red-600">{errors.addressLine1}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
              />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
              />
              {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
            </div>
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark disabled:opacity-50"
          >
            {isSubmitting ? "Redirecting to payment..." : "Continue to Payment"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg text-ink">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-ink">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-line pt-4">
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-full bg-green-50 px-4 py-2">
                <span className="text-sm text-green-800">
                  Code <strong>{appliedCoupon.code}</strong> applied
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-sm text-green-800 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand disabled:opacity-50"
                >
                  {isApplyingCoupon ? "..." : "Apply"}
                </button>
              </div>
            )}
            {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            <div className="flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Discount</span>
                <span>−${appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-ink">Total</span>
              <span className="text-xl font-semibold text-brand">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
