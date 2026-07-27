"use client";

import { useCartStore } from "@/lib/cart-store";

export default function CartBadge() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  if (!hasHydrated || itemCount === 0) {
    return null;
  }

  return (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-semibold text-ink">
      {itemCount}
    </span>
  );
}
