import Link from "next/link";
import { auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import CartBadge from "./CartBadge";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-2xl font-semibold text-brand">
          AbdiMarket
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-ink hover:text-brand">
            Shop
          </Link>
          {session?.user ? (
            <>
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
            <button className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand">
              Cart
            </button>
            <CartBadge />
          </div>
        </nav>
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
