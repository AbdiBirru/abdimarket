"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/lib/actions/wishlist";

type Props = {
  productId: string;
  initialIsWishlisted: boolean;
  isLoggedIn: boolean;
};

export default function WishlistButton({
  productId,
  initialIsWishlisted,
  isLoggedIn,
}: Props) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const next = !isWishlisted;
    setIsWishlisted(next);

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if ("error" in result) {
        setIsWishlisted(!next);
        router.push("/login");
      } else {
        setIsWishlisted(result.wishlisted);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm hover:bg-white"
    >
      {isWishlisted ? "♥" : "♡"}
    </button>
  );
}
