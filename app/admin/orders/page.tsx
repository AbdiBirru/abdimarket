import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Orders</h2>
      <div className="mt-6 flex flex-col gap-3">
        {orders.map((order) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <div
              key={order.id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={`/orders/${order.id}`}
                  className="font-medium text-ink hover:text-brand"
                >
                  Order #{order.id.slice(-8).toUpperCase()}
                </Link>
                <p className="text-sm text-ink/60">
                  {order.user.name} ({order.user.email})
                </p>
                <p className="text-sm text-ink/60">
                  {order.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {" · "}
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                  {" · "}${Number(order.total).toFixed(2)}
                </p>
              </div>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
