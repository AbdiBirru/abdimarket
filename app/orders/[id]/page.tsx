import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderStatusTracker from "@/components/OrderStatusTracker";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <p className="mt-2 text-ink/70">
          Placed{" "}
          {order.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Items</h2>
        <div className="mt-4 flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink/70">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-ink">
                ${(Number(item.priceAtPurchase) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span className="font-medium text-ink">Total</span>
          <span className="text-xl font-semibold text-brand">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">Shipping to</h2>
        <p className="mt-2 text-sm text-ink/70">{order.shippingName}</p>
        <p className="text-sm text-ink/70">{order.shippingAddress}</p>
        <p className="text-sm text-ink/70">
          {order.shippingCity}, {order.shippingPostalCode}
        </p>
        <p className="text-sm text-ink/70">{order.shippingPhone}</p>
      </div>

      <Link
        href="/"
        className="mt-8 block w-full rounded-full bg-brand px-6 py-3 text-center font-medium text-paper hover:bg-brand-dark"
      >
        Back to shop
      </Link>
    </div>
  );
}
