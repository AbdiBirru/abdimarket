import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl text-ink">My Account</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <p className="text-sm text-ink/60">Name</p>
        <p className="text-ink">{session.user.name}</p>
        <p className="mt-4 text-sm text-ink/60">Email</p>
        <p className="text-ink">{session.user.email}</p>
      </div>
    </div>
  );
}
