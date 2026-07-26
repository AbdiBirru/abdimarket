import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm text-ink/60 hover:text-brand">
        ← Back to shop
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-line">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-brand">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-ink/70">{product.description}</p>
          <p className="mt-4 text-sm text-ink/60">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <button
            disabled={product.stock === 0}
            className="mt-6 w-full rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink/40 sm:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
