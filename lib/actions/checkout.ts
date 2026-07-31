"use server";

import { auth } from "@/lib/auth";

type CartItemInput = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ShippingInput = {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode: string;
};

export async function createCheckoutSession(
  items: CartItemInput[],
  shipping: ShippingInput
) {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be logged in to check out." };
  }

  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  // No real payment gateway connected yet. This stands in for creating a
  // Stripe/Chapa session and getting back a redirect URL — everything
  // else in the app stays the same when a real one gets wired in later.
  return { url: "/checkout/simulate" };
}
