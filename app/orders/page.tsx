import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink">No orders yet</h1>
        <p className="mt-2 text-ink/70">When you place an order, it&apos;ll show up here.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-medium text-paper hover:bg-brand-dark"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink">My Orders</h1>
      <div className="mt-6 flex flex-col gap-4">
        {orders.map((order) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-white p-4 hover:border-brand"
            >
              <div>
                <p className="font-medium text-ink">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-ink/60">
                  {order.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {" · "}
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-brand">${Number(order.total).toFixed(2)}</p>
                <div className="mt-1">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
