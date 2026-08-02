import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { isProductWishlisted } from "@/lib/wishlist";
import { getProductReviews, getUserReviewForProduct } from "@/lib/reviews";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ProductGallery from "@/components/ProductGallery";
import RatingSummary from "@/components/RatingSummary";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, session] = await Promise.all([getProductById(id), auth()]);

  if (!product) {
    notFound();
  }

  const [isWishlisted, { reviews, averageRating, count }, existingReview] =
    await Promise.all([
      isProductWishlisted(session?.user?.id, product.id),
      getProductReviews(product.id),
      getUserReviewForProduct(session?.user?.id, product.id),
    ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(averageRating !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating,
        reviewCount: count,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="text-sm text-ink/60 hover:text-brand">
        ← Back to shop
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative">
          <ProductGallery images={product.images} productName={product.name} />
          <WishlistButton
            productId={product.id}
            initialIsWishlisted={isWishlisted}
            isLoggedIn={!!session?.user}
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">{product.name}</h1>
          <div className="mt-2">
            <RatingSummary averageRating={averageRating} count={count} />
          </div>
          <p className="mt-4 text-2xl font-semibold text-brand">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-ink/70">{product.description}</p>
          <p className="mt-4 text-sm text-ink/60">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
            }}
            disabled={product.stock === 0}
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-ink">Reviews</h2>
          <div className="mt-4">
            <ReviewList reviews={reviews} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl text-ink">
            {session?.user ? "Your Review" : "Leave a Review"}
          </h2>
          <div className="mt-4">
            {session?.user ? (
              <ReviewForm
                productId={product.id}
                existingReview={
                  existingReview
                    ? { rating: existingReview.rating, comment: existingReview.comment }
                    : null
                }
              />
            ) : (
              <p className="text-sm text-ink/60">
                <Link
                  href={`/login?callbackUrl=/products/${product.id}`}
                  className="text-brand hover:underline"
                >
                  Log in
                </Link>{" "}
                to leave a review.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
