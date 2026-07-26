import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { getProducts } from "@/lib/products";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;
  const products = await getProducts({ query: q, category, sort });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Shop AbdiMarket
        </h1>
        <p className="mt-2 text-ink/70">
          Handpicked goods, delivered to your door.
        </p>
      </div>

      <Suspense fallback={null}>
        <ProductFilters />
      </Suspense>

      {products.length === 0 ? (
        <p className="text-ink/60">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
