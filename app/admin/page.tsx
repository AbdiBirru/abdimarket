import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [orderStats, productCount, userCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.product.count(),
    prisma.user.count(),
  ]);

  const totalRevenue = Number(orderStats._sum.total ?? 0);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-2xl border border-line bg-white p-6">
        <p className="text-sm text-ink/60">Total Revenue</p>
        <p className="mt-2 font-display text-2xl text-brand">
          ${totalRevenue.toFixed(2)}
        </p>
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
    </div>
  );
}
