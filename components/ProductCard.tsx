import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import WishlistButton from "./WishlistButton";

export default function ProductCard({
  product,
  isWishlisted,
  isLoggedIn,
}: {
  product: Product;
  isWishlisted: boolean;
  isLoggedIn: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-white">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-line">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
          <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink/70">{product.description}</p>
          <p className="mt-3 font-semibold text-brand">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <WishlistButton
        productId={product.id}
        initialIsWishlisted={isWishlisted}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
