"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  disabled?: boolean;
};

export default function AddToCartButton({ product, disabled }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="mt-6 w-full rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink/40 sm:w-auto"
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
