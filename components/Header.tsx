import Link from "next/link";
import { auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import CartBadge from "./CartBadge";
import MobileNav from "./MobileNav";

export default async function Header() {
  const session = await auth();

  return (
    <header className="relative bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-2xl font-semibold text-brand">
          AbdiMarket
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium text-ink hover:text-brand">
            Shop
          </Link>
          {session?.user ? (
            <>
              <Link href="/wishlist" className="text-sm font-medium text-ink hover:text-brand">
                Wishlist
              </Link>
              <Link href="/orders" className="text-sm font-medium text-ink hover:text-brand">
                Orders
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-medium text-ink hover:text-brand">
                  Admin
                </Link>
              )}
              <Link href="/account" className="text-sm font-medium text-ink hover:text-brand">
                {session.user.name}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink hover:text-brand">
                Log In
              </Link>
              <Link href="/register" className="text-sm font-medium text-ink hover:text-brand">
                Sign Up
              </Link>
            </>
          )}
          <div className="relative">
            <Link
              href="/cart"
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
            >
              Cart
            </Link>
            <CartBadge />
          </div>
        </nav>

        <div className="flex items-center gap-4 sm:hidden">
          <MobileNav
            isLoggedIn={!!session?.user}
            isAdmin={session?.user?.role === "ADMIN"}
          />
          {session?.user ? (
            <Link
              href="/account"
              className="max-w-[80px] truncate text-sm font-medium text-ink hover:text-brand"
            >
              {session.user.name}
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium text-ink hover:text-brand">
              Log In
            </Link>
          )}
        </div>
      </div>
      <div
        className="h-1.5 w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-brand) 0px, var(--color-brand) 8px, var(--color-gold) 8px, var(--color-gold) 16px)",
        }}
      />
    </header>
  );
}
