import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import StockBadge from "@/components/admin/StockBadge";
import QuickStockEditor from "@/components/admin/QuickStockEditor";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Products</h2>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-paper hover:bg-brand-dark"
        >
          + New Product
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-ink">{product.name}</p>
              <p className="text-sm text-ink/60">
                {product.category} · ${Number(product.price).toFixed(2)}
              </p>
              <div className="mt-2">
                <StockBadge stock={product.stock} />
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <QuickStockEditor productId={product.id} initialStock={product.stock} />
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  Edit
                </Link>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
