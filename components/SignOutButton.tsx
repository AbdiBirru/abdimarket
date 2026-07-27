"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-ink hover:text-brand"
    >
      Log Out
    </button>
  );
}
