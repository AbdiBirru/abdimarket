import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return <CheckoutForm />;
}
