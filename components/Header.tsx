import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-2xl font-semibold text-brand">
          AbdiMarket
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-ink hover:text-brand">
            Shop
          </Link>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand">
            Cart
          </button>
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
