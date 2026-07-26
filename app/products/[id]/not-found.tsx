import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-ink">Product not found</h1>
      <p className="mt-2 text-ink/70">
        We couldn't find the product you were looking for.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark"
      >
        Back to shop
      </Link>
    </div>
  );
}
