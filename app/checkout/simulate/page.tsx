"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

export default function SimulatedPaymentPage() {
  const router = useRouter();
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const [isPaying, setIsPaying] = useState(false);

  if (!hasHydrated) {
    return null;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      router.push("/checkout/success");
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-line bg-white p-6">
        <p className="text-xs uppercase tracking-wide text-ink/50">Simulated Payment</p>
        <h1 className="mt-1 font-display text-2xl text-ink">
          Pay ${total.toFixed(2)}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          No real payment gateway is connected yet — this screen stands in for one
          so the rest of checkout works end to end.
        </p>

        <form onSubmit={handlePay} className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Card number"
            defaultValue="4242 4242 4242 4242"
            className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              defaultValue="12/30"
              className="w-1/2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
            <input
              type="text"
              placeholder="CVC"
              defaultValue="123"
              className="w-1/2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isPaying}
            className="mt-2 rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark disabled:opacity-50"
          >
            {isPaying ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
