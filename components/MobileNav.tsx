"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import SignOutButton from "./SignOutButton";

type Props = {
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export default function MobileNav({ isLoggedIn, isAdmin }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1"
      >
        <span
          className={`h-0.5 w-5 bg-ink transition-transform ${
            isOpen ? "translate-y-1.5 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-5 bg-ink transition-opacity ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 w-5 bg-ink transition-transform ${
            isOpen ? "-translate-y-1.5 -rotate-45" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-line bg-paper px-4 py-4 shadow-sm">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-ink hover:text-brand"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-ink hover:text-brand"
            >
              Cart
              {hasHydrated && itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-semibold text-ink">
                  {itemCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-ink hover:text-brand"
                >
                  Wishlist
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-ink hover:text-brand"
                >
                  Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-ink hover:text-brand"
                  >
                    Admin
                  </Link>
                )}
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-ink hover:text-brand"
              >
                Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
