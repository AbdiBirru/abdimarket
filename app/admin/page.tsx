import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory";
import StockBadge from "@/components/admin/StockBadge";

export default async function AdminDashboardPage() {
  const [orderStats, productCount, userCount, lowStockProducts] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.product.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: "asc" },
    }),
  ]);

  const totalRevenue = Number(orderStats._sum.total ?? 0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-ink/60">Total Revenue</p>
          <p className="mt-2 font-display text-2xl text-brand">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-ink/60">Paid Orders</p>
          <p className="mt-2 font-display text-2xl text-ink">{orderStats._count}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-ink/60">Products</p>
          <p className="mt-2 font-display text-2xl text-ink">{productCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-ink/60">Users</p>
          <p className="mt-2 font-display text-2xl text-ink">{userCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-ink/60">Low Stock</p>
          <p className="mt-2 font-display text-2xl text-ink">{lowStockProducts.length}</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg text-ink">Needs Restocking</h2>
          <div className="mt-4 flex flex-col gap-3">
            {lowStockProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-between rounded-2xl border border-line bg-white p-4 hover:border-brand"
              >
                <p className="font-medium text-ink">{product.name}</p>
                <StockBadge stock={product.stock} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
