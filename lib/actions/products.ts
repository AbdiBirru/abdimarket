"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

type ActionResult = { error: string } | { success: true };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function createProduct(data: unknown): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Not authorized." };
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { additionalImageUrls, ...productFields } = result.data;

  await prisma.product.create({
    data: {
      ...productFields,
      images: {
        create: additionalImageUrls.map((url, i) => ({ url, position: i })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}

export async function updateProduct(id: string, data: unknown): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Not authorized." };
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { additionalImageUrls, ...productFields } = result.data;

  await prisma.product.update({
    where: { id },
    data: {
      ...productFields,
      images: {
        deleteMany: {},
        create: additionalImageUrls.map((url, i) => ({ url, position: i })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/products/${id}`);

  return { success: true };
}

export async function updateStock(id: string, stock: number): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Not authorized." };
  }

  if (stock < 0) {
    return { error: "Stock can't be negative." };
  }

  await prisma.product.update({ where: { id }, data: { stock } });

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { error: "Not authorized." };
  }

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return { error: "Can't delete a product that's part of existing orders." };
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}
