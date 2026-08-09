"use client";

import { useState } from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

type Props = {
  isLoggedIn: boolean;
  userName: string | null;
  isAdmin: boolean;
};

export default function MobileNav({ isLoggedIn, userName, isAdmin }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Menu"
        className="flex h-9 w-9 flex-col items-center justify-center gap-1"
      >
        <span className="h-0.5 w-5 bg-ink" />
        <span className="h-0.5 w-5 bg-ink" />
        <span className="h-0.5 w-5 bg-ink" />
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
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-ink hover:text-brand"
                >
                  {userName}
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-ink hover:text-brand"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-ink hover:text-brand"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
