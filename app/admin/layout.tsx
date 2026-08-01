import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h1 className="font-display text-2xl text-ink">Admin</h1>
        <nav className="flex gap-4 text-sm font-medium text-ink/60">
          <Link href="/admin" className="hover:text-brand">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:text-brand">
            Products
          </Link>
          <Link href="/" className="hover:text-brand">
            Back to Shop
          </Link>
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
