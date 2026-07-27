import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink">Your wishlist is empty</h1>
        <p className="mt-2 text-ink/70">Tap the heart on any product to save it here.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const products = items.map(({ product }) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category,
    stock: product.stock,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">Your Wishlist</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={true}
            isLoggedIn={true}
          />
        ))}
      </div>
    </div>
  );
}
