import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";
import { getProducts } from "@/lib/products";
import { auth } from "@/lib/auth";
import { getWishlistedProductIds } from "@/lib/wishlist";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const { q, category, sort, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [{ products, totalPages }, session] = await Promise.all([
    getProducts({ query: q, category, sort, page: currentPage }),
    auth(),
  ]);
  const wishlistedIds = await getWishlistedProductIds(session?.user?.id);

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
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistedIds.has(product.id)}
                isLoggedIn={!!session?.user}
              />
            ))}
          </div>
          <Suspense fallback={null}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </div>
  );
}
