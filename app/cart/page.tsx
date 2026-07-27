"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (!hasHydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink/70">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">Your Cart</h1>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-2xl border border-line bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-line">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-sm text-ink/60">${item.price.toFixed(2)} each</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-ink/40 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 rounded-full border border-line text-ink hover:border-brand hover:text-brand disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-ink">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-line text-ink hover:border-brand hover:text-brand"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold text-brand">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <p className="text-lg font-medium text-ink">Total</p>
        <p className="text-2xl font-semibold text-brand">${total.toFixed(2)}</p>
      </div>

      <button
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-full bg-line px-6 py-3 font-medium text-ink/40"
      >
        Proceed to Checkout (arrives Day 13)
      </button>
    </div>
  );
}
